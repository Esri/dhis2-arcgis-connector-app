# Org-unit selection: user-scoped roots, level/group bulk-select, and a resolves-to preview

Step 1's org-unit selector uses the DHIS2 `OrgUnitDimension`, whose "Select a level" (and "Select a group") emits an `ou` dimension of the form `<boundary>;LEVEL-<uid>`. DHIS2 analytics reads that as *"org units at that level under the boundary."* When the checked boundary is not a higher ancestor of the chosen level, the selection silently resolves to just the boundary — an author picks "districts" and gets one country-level row with no explanation. Explicit tree selection works but is tedious for bulk selections. Separately, the tree roots were not scoped to the signed-in user.

We keep the `OrgUnitDimension` (levels and groups are genuinely useful for bulk selection) and **extend** it rather than rebuild:

- **Levels/groups are reframed as user-scoped bulk selects.** When a level or group is chosen with nothing checked in the tree, the user's own root org units are injected as the boundary, so "District" means "all districts I can see." A checked parent narrows it.
- **Selection is made visible.** Step 1 shows what the current selection **resolves to** — the count of mappable org units and their geometry type — so a level/boundary mismatch is obvious instead of silent. The resolution is derived from the `geoFeatures` call the wizard already makes; the #48 Preview remains the authoritative exact view.
- **The tree is scoped to the user.** Roots come from the signed-in user's `dataViewOrganisationUnits`, falling back to `organisationUnits`.

The single source of truth is a pure `resolveOuDimension(rawSelection, userRoots)` that produces the `ou` id list feeding both the `geoFeatures` pre-check and the created service's `dataProviderHost`.

## Consequences

- A level/group selected with no explicit boundary resolves against the user's roots, not the whole instance or an undefined default.
- The `geoFeatures` pre-check and the `dataProviderHost` are always built from the same resolved `ou`, so what the preview reports and what the service serves cannot diverge.
- The single-geometry-type rule (ADR-0001, issue #42) stays a **hard block**; the resolves-to panel makes a mixed-geometry selection visible and actionable rather than a silent stop. Auto-splitting a mixed selection into multiple Connections is deferred (issue #59).
- The resolves-to count is of **mappable** units (those with geometry); geometry-less units are surfaced separately as table-only. An exact total including geometry-less units is deferred unless the mappable count proves insufficient.
