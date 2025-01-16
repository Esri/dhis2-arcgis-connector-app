/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
// import { OAuthInfo, IdentityManager } from "@arcgis/core/identity";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import { getPortalHostingServer, getUserInfo } from "../util/portal";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userCredential, setUserCredential] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [error, setError] = useState(null);
  const [oAuthConfig, setOAuthConfig] = useState(null);
  const [hostingServerProperties, setHostingServerProperties] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!oAuthConfig || userCredential) return;

      try {
        const oAuthInfo = new OAuthInfo(oAuthConfig);

        esriId.registerOAuthInfos([oAuthInfo]);

        // Check if user is already signed in
        try {
          const credential = await esriId.checkSignInStatus(
            `${oAuthInfo.portalUrl}/sharing`
          );
          setUserCredential(credential);

          const userInfo = await getUserInfo(
            oAuthInfo.portalUrl,
            credential.userId,
            credential.token
          );

          // console.log(userInfo);

          userInfo.portalUrl = oAuthInfo.portalUrl;
          setUserInformation(userInfo);

          // https://dhis2enterprise.esrigcazure.com/portal/sharing/rest/portals/self/servers?
          const hostingServer = await getPortalHostingServer(
            oAuthInfo.portalUrl,
            credential.token
          );
          setHostingServerProperties(hostingServer);
        } catch (err) {
          // User is not signed in
          console.error("Error getting credentials", err);
          setUserCredential(null);
          setUserInformation(null);
        }
      } catch (err) {
        console.error("Error initializing auth", err);
        setError(err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initializeAuth();
  }, [oAuthConfig, userCredential]);

  const signIn = async () => {
    if (!oAuthConfig) return;
    try {
      const credential = await esriId.getCredential(
        `${oAuthConfig.portalUrl}/sharing`
      );
      setUserCredential(credential);
      return credential;
    } catch (err) {
      setError(err);
      console.error("Error signing in", err);
    }
  };

  const signOut = () => {
    esriId.destroyCredentials();
    setUserCredential(null);
    setUserInformation(null);
  };

  const value = {
    userCredential,
    setUserCredential,
    isLoadingAuth,
    error,
    signIn,
    signOut,
    userInformation,
    oAuthConfig,
    setOAuthConfig,
    hostingServerProperties,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
