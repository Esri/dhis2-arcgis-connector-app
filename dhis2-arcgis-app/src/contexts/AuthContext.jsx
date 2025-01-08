/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
// import { OAuthInfo, IdentityManager } from "@arcgis/core/identity";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";

const AuthContext = createContext();

export function AuthProvider({ children, clientId, portalUrl }) {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const oauthInfo = new OAuthInfo({
          appId: clientId,
          popup: false,
          //   popupCallbackUrl: "http://localhost:3000",
          //   portalUrl: portalUrl,
        });

        setInfo(oauthInfo);
        esriId.registerOAuthInfos([oauthInfo]);

        // Check if user is already signed in
        try {
          const credential = await esriId.checkSignInStatus(
            `${oauthInfo.portalUrl}/sharing`
          );
          setUser(credential);

          const userInfoUrl = `${oauthInfo.portalUrl}/sharing/rest/community/users/${credential.userId}?f=json&token=${credential.token}`;
          const userInfoResponse = await fetch(userInfoUrl);
          const userInfo = await userInfoResponse.json();
          userInfo.portalUrl = oauthInfo.portalUrl;
          setUserInfo(userInfo);
        } catch {
          // User is not signed in
          setUser(null);
          setUserInfo(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clientId, portalUrl]);

  const signIn = async () => {
    if (!info) return;
    try {
      const credential = await esriId.getCredential(
        `${info.portalUrl}/sharing`,
        {
          oAuthPopupConfirmation: false, // Prevents double popup
        }
      );

      setUser(credential);

      return credential;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signOut = () => {
    esriId.destroyCredentials();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    userInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
