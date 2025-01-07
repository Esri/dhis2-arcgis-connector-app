// Parse polygons - always as MultiPolygon
// - DHIS2 mixes Polygon and MultiPolygon in the same datasets and ArcGIS
//   requires a single geometry type
// - Rather than validate all are one or the other, convert regular polys
//   to MultiPolygon
const polygonParser = (coords) =>
  coords[3] === "[" ? JSON.parse(coords) : JSON.parse(`[${coords}]`);

// Parse Points
const pointParser = (coords) => JSON.parse(coords);

module.exports = async function (ouIds) {
  // Get the organisation unit geometry from the geoFeatures API
  const url = `${process.env.DHIS2_API}/geoFeatures?ou=ou:${ouIds.join(";")}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `ApiToken ${process.env.DHIS2_KEY}`,
    },
    method: "GET",
  });
  const responseJson = await response.json();

  // Determine the geometry type
  const geometryType = responseJson[0].ty === 1 ? "Point" : "MultiPolygon";

  // Create a object to lookup coordinates from
  const ouGeos = {};
  responseJson.forEach((orgUnitRow) => {
    const coords =
      geometryType === "Point"
        ? pointParser(orgUnitRow.co)
        : polygonParser(orgUnitRow.co);
    ouGeos[orgUnitRow.id] = coords;
  });

  return {
    geometryType,
    ouGeos,
  };
};
