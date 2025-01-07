require("dotenv").config();
const parseAnalytics = require("./parseAnalytics");

function Model(koop) {}

function decode(host) {
  return atob(host.replace(/-/g, "+").replace(/_/g, "/"));
}

// Validate the statment
function tableLayoutDefined(statement) {
  const hasTableLayout = statement.includes("tableLayout=true");
  const hasRows = statement.includes("columns=");
  const hasCols = statement.includes("rows=");
  return hasTableLayout && hasRows && hasCols;
}

Model.prototype.getData = function (req, callback) {
  // Decode and validate the host value
  const statement = decode(req.params.host);
  if (!tableLayoutDefined(statement))
    callback(`Table layout not defined in ${statement}`, null);

  // Call the Analytics API with the decoded query statement
  const url = `${process.env.DHIS2_API}/analytics?${statement}`;
  try {
    fetch(url, {
      headers: {
        Authorization: `ApiToken ${process.env.DHIS2_KEY}`,
      },
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((responseJson) => {
            // Parse the response
            parseAnalytics(responseJson).then(({ geoJson, metadata }) => {
              metadata.name = "DHIS2 Data";
              geoJson.metadata = metadata;
              callback(null, geoJson);
            });
          });
        } else {
          console.log(response);
          callback({ error: `reponse ${response.status} from dhis2` });
        }
      })
      .catch((e) => {
        callback({ error: e });
        console.log(e, url);
      });
  } catch (e) {
    callback({ error: e });
    console.log(e, url);
  }
};

module.exports = Model;
