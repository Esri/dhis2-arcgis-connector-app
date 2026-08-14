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

const MAX_NAME_LENGTH = 50;

const displayNameOf = (item) =>
  item?.name ?? item?.displayName ?? item?.label ?? item?.id ?? "";

// "A", "A and B", "A, B and C" — lists every name so the description spells the
// selection out rather than hiding extras behind an "and N more" count.
const listNames = (items) => {
  const names = items.map(displayNameOf).filter(Boolean);
  if (names.length <= 1) {
    return names[0] ?? "";
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
};

// Sanitize to an ArcGIS-safe service name: disallowed runs become "_",
// collapse repeats, trim leading/trailing "_".
export const sanitizeName = (raw = "") =>
  raw
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

const capName = (name) =>
  name.length <= MAX_NAME_LENGTH
    ? name
    : name.slice(0, MAX_NAME_LENGTH).replace(/_+$/, "");

// nth availability of a name: 1 -> base, 2 -> base_2, ... capped at 50 chars.
export const applyNameSuffix = (base, occurrence) => {
  if (!base || occurrence <= 1) {
    return base;
  }
  const suffix = `_${occurrence}`;
  const room = MAX_NAME_LENGTH - suffix.length;
  const trimmed = base.length > room ? base.slice(0, room) : base;
  return `${trimmed.replace(/_+$/, "")}${suffix}`;
};

// Org units are listed in the name only up to this many; beyond it the name
// would get unwieldy (e.g. 10 districts), so they are dropped and left to the
// description.
const ORG_UNITS_IN_NAME_LIMIT = 3;

// Suggested service name from the selection: first data item, the org units
// (only when few enough to stay readable), and first period. Extra data
// items/periods and large org-unit sets are reflected in the description, not
// the name.
export const suggestConnectionName = ({
  dataItems = [],
  orgUnits = [],
  periods = [],
} = {}) => {
  const orgUnitParts =
    orgUnits.length > 0 && orgUnits.length <= ORG_UNITS_IN_NAME_LIMIT
      ? orgUnits.map(displayNameOf)
      : [];

  const parts = [displayNameOf(dataItems[0]), ...orgUnitParts, displayNameOf(periods[0])]
    .filter(Boolean);

  if (!parts.length) {
    return "";
  }

  return capName(sanitizeName(parts.join("_")));
};

// Readable, editable default description for the Summary step. Every selected
// data item, org unit, and period is listed so the author can see exactly what
// the Connection covers.
export const suggestDescription = ({
  dataItems = [],
  orgUnits = [],
  periods = [],
} = {}) => {
  if (!dataItems.length && !orgUnits.length && !periods.length) {
    return "";
  }

  const lead = dataItems.length
    ? listNames(dataItems)
    : "Organisation unit data";
  const where = orgUnits.length ? ` in ${listNames(orgUnits)}` : "";
  const when = periods.length ? ` for ${listNames(periods)}` : "";

  return `${lead}${where}${when}.`;
};
