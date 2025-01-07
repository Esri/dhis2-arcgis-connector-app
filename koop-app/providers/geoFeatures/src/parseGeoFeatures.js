// Parse polygons - always as MultiPolygon
// - DHIS2 mixes Polygon and MultiPolygon in the same datasets and ArcGIS
//   requires a single geometry type
// - Rather than validate all are one or the other, convert regular polys
//   to MultiPolygon
const polygonParser = (coords) =>
  coords[3] === "[" ? JSON.parse(coords) : JSON.parse(`[${coords}]`);

// Parse Points
const pointParser = (coords) => JSON.parse(coords);

function parseRow(row, index) {
  // Set the geometry type based on the ty property
  // - See comment on polygon parser - Polygon always treated as MultiPolygon
  const geometryType = row.ty === 1 ? "Point" : "MultiPolygon";

  // Parse the co property according to its geometry type
  const coords =
    geometryType === "Point" ? pointParser(row.co) : polygonParser(row.co);

  // Return a geojson representation of the data
  return {
    type: "Feature",
    properties: {
      id: index + 1,
      dhis2Id: row.id,
      code: row.code,
      na: row.na,
      hcd: row.hcd,
      hcu: row.hcu,
      le: row.le,
      pg: row.pg,
      pi: row.pi,
      pn: row.pn,
      ty: row.cy,
    },
    geometry: {
      type: geometryType,
      coordinates: coords,
    },
  };
}

module.exports = function (responseJson) {
  // Convert the response JSON to GeoJson.
  const geoJson = {
    type: "FeatureCollection",
    features: responseJson.map((row, index) => parseRow(row, index)),
  };
  // Return the GeoJSON data and geometry type
  const geometryType = geoJson.features[0].geometry.type;
  return { geoJson, geometryType };
};
