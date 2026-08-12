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

// calcite-table-header renders `description` as plain text (no slot for a
// calcite-icon), so the sort affordance is a text glyph.
export const NEUTRAL_GLYPH = "\u21C5"; // ⇅ up/down arrows: this column can be sorted
export const ASC_GLYPH = "\u25B2"; // ▲
export const DESC_GLYPH = "\u25BC"; // ▼

// Maps a column against the current sort state to its header glyph. `label` is
// suitable for assistive text; `direction` is null when the column is sortable
// but not the active sort.
export function getSortIndicator(columnKey, sortConfig) {
  const isActive = sortConfig?.key === columnKey;
  if (!isActive) {
    return { glyph: NEUTRAL_GLYPH, label: "Sortable", direction: null };
  }
  return sortConfig.direction === "asc"
    ? { glyph: ASC_GLYPH, label: "Sorted ascending", direction: "asc" }
    : { glyph: DESC_GLYPH, label: "Sorted descending", direction: "desc" };
}
