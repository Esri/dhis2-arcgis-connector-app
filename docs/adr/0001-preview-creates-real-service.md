# Preview creates the real feature service, then keeps or discards

To give a high-fidelity "preview data" experience (real map + attribute table) before a user commits to a Connection, Preview **creates the actual, final-named feature service** and shows it, after which the user either keeps it (commit) or discards it (delete). We chose this over a lightweight client-side preview that re-derives geometry/attributes in the browser, because that would duplicate the CDF provider's transform and could silently diverge from the real result (the exact class of bug issue #38 addresses).

## Consequences

- There is no separate "Create Connection" step after a successful preview — "Keep" is the commit.
- The layer name must be valid + available and the single-geometry-type check (issue #38) must pass **before** Preview runs, since Preview is the real creation.
- Discard/Cancel must delete both artifacts (portal item + CDF service). Abandoning via hard-close can orphan a service; preview-created services are tagged with a typeKeyword so orphans are findable and cleanable later.
