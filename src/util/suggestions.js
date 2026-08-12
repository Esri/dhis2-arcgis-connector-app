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

const nameWithMore = (items) => {
  if (!items.length) {
    return "";
  }
  const first = displayNameOf(items[0]);
  const more = items.length - 1;
  return more > 0 ? `${first} and ${more} more` : first;
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

// Suggested service name from the selection: first data item + first org unit
// + first period, with a short "_plusN" count when multiple are selected.
export const suggestConnectionName = ({
  dataItems = [],
  orgUnits = [],
  periods = [],
} = {}) => {
  const parts = [dataItems[0], orgUnits[0], periods[0]]
    .filter(Boolean)
    .map(displayNameOf)
    .filter(Boolean);

  if (!parts.length) {
    return "";
  }

  const extra =
    Math.max(0, dataItems.length - 1) +
    Math.max(0, orgUnits.length - 1) +
    Math.max(0, periods.length - 1);

  const base = sanitizeName(parts.join("_"));
  return capName(extra > 0 ? `${base}_plus${extra}` : base);
};

// Readable, editable default description for the Summary step.
export const suggestDescription = ({
  dataItems = [],
  orgUnits = [],
  periods = [],
} = {}) => {
  if (!dataItems.length && !orgUnits.length && !periods.length) {
    return "";
  }

  const lead = dataItems.length
    ? nameWithMore(dataItems)
    : "Organisation unit data";
  const where = orgUnits.length ? ` in ${nameWithMore(orgUnits)}` : "";
  const when = periods.length ? ` for ${nameWithMore(periods)}` : "";

  return `${lead}${where}${when}.`;
};
