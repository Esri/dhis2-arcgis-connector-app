/*Copyright 2025 Esri
Licensed under the Apache License Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

// Geometry type resolved from the DHIS2 geoFeatures `ty` code, never from
// org-unit level. 1 = Point, 2 = Polygon.
const GEOMETRY_TYPE_BY_TY = {
  1: "Point",
  2: "Polygon",
};

const ORDERED_GEOMETRY_TYPES = ["Point", "Polygon"];

// Distinct geometry types present in the selection, ignoring units that carry
// no geometry. Deterministically ordered so callers and tests can compare.
export const deriveGeometryTypes = (geoFeatures = []) => {
  const present = new Set();
  for (const feature of geoFeatures) {
    const type = GEOMETRY_TYPE_BY_TY[feature?.ty];
    if (type) {
      present.add(type);
    }
  }
  return ORDERED_GEOMETRY_TYPES.filter((type) => present.has(type));
};

export const isMixedGeometry = (geoFeatures = []) =>
  deriveGeometryTypes(geoFeatures).length > 1;

// Single validity outcome the org-unit step's continue/Create control consumes.
// - mixed: more than one geometry type -> blocked.
// - none: no unit has geometry -> allowed (table-only Connection).
// - partial: one type, but some selected units lack geometry -> allowed, warn.
// - ok: one type and every selected unit has geometry -> allowed.
export const evaluateGeometrySelection = ({
  geoFeatures = [],
  selectedCount = 0,
} = {}) => {
  const geometryTypes = deriveGeometryTypes(geoFeatures);

  if (geometryTypes.length > 1) {
    return { valid: false, status: "mixed", geometryTypes };
  }

  if (geometryTypes.length === 0) {
    return { valid: true, status: "none", geometryTypes };
  }

  const unitsWithGeometry = geoFeatures.filter(
    (feature) => GEOMETRY_TYPE_BY_TY[feature?.ty]
  ).length;

  if (unitsWithGeometry < selectedCount) {
    return { valid: true, status: "partial", geometryTypes };
  }

  return { valid: true, status: "ok", geometryTypes };
};
