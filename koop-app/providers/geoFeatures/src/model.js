require("dotenv").config();
const parseGeoFeatures = require("./parseGeoFeatures");

function Model(koop) {}

function decode(host) {
  return atob(host.replace(/-/g, "+").replace(/_/g, "/"));
}

Model.prototype.getData = function (req, callback) {
  // Decode the geofeatures query statment from :host
  const statement = decode(req.params.host);
  // Construct a url for Fetch
  const url = `${process.env.DHIS2_API}/geoFeatures?${statement}`;
  try {
    fetch(url, {
      headers: {
        Authorization: `ApiToken ${process.env.DHIS2_KEY}`,
      },
      method: "GET",
    })
      .then((response) => {
        // If there is a valid response...
        if (response.status === 200) {
          // Convert to JSON, then parse to GeoJSON
          response.json().then((responseJson) => {
            const { geoJson, geometryType } = parseGeoFeatures(responseJson);
            // Set the Geometry type and layer name.
            // Geometry of a geofeature can be either point or polygon
            geoJson.metadata = {
              name: "DHIS2 GeoFeatures",
              geometryType,
            };
            // Koop callback
            callback(null, geoJson);
          });
        } else {
          // Otherwise, raise an error and note that it comes from DHIS 2
          callback(`reponse ${response.status} from dhis2`);
        }
      })
      .catch((e) => {
        // Catch any errors from fetch
        callback({ error: `Error when fetching: ${e}. Url: ${url}` });
      });
  } catch (e) {
    // Catch errors other than from fetch
    callback({ error: e });
  }
};

module.exports = Model;
