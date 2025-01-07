// Given a list of ouIds, return geoemtry type and an array of geometries
const getOuGeos = require("./getOuGeos");

// From the Analytics Headers respones, get the properties
function parseHeaders(headers) {
  return headers.map((header, index) => {
    return {
      name: header.column,
      alias: header.name,
      index,
    };
  });
}

// Get the index calue of the org unit ID
// - TODO: LEARN MORE ABOUT HOW IDs work - IS THIS SAFE TO HARD CODE? HOW TO DETERMINE?
// - TODO: LEARN ABOUT OTHER COORDINATE / GEOMETRY CASES
function getOuIdIndex(headers) {
  let ouIdIndex;
  const ouIdFieldName = "organisationunitid";
  headers.forEach((header, index) => {
    if (header.column === ouIdFieldName) ouIdIndex = index;
  });
  return ouIdIndex;
}

// Parse an individual row
function getProperties(row, index, propertyInfo) {
  // Parse row data into properties and
  const properties = { id: index + 1 };
  propertyInfo.forEach(
    (property) => (properties[property.name] = row[property.index])
  );

  // Return the geojson properties (attribute values) for the row
  return properties;
}

module.exports = async function (responseJson) {
  // Get property information and org unit index from the response headers
  const propertyInfo = parseHeaders(responseJson.headers);
  const ouIdIndex = getOuIdIndex(responseJson.headers);

  // Get the coordinates for each org unit
  const { geometryType, ouGeos } = await getOuGeos(
    responseJson.metaData.dimensions.ou
  );

  // Convert the response JSON to GeoJson.
  const geoJson = {
    type: "FeatureCollection",
    features: responseJson.rows.map(
      (row, index) => {
        return {
          type: "Feature",
          properties: getProperties(row, index, propertyInfo),
          geometry: {
            type: geometryType,
            coordinates: ouGeos[row[ouIdIndex]],
          },
        };
      }
      // parseRow(row, index, propertyInfo, ouGeos, geometryType)
    ),
  };
  // Return the GeoJSON data and geometry type
  const metadata = {
    geometryType,
    fields: propertyInfo.map((property) => {
      return { name: property.name, alias: property.alias };
    }),
  };
  return { geoJson, metadata };
};
