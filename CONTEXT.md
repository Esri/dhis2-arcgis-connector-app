# DHIS2 → ArcGIS Connector

A DHIS2 web app that publishes selected DHIS2 analytics data as live ArcGIS Enterprise feature services, so DHIS2 data can be mapped and analyzed in ArcGIS without copying it out of DHIS2.

## Language

**Connection**:
A live, DHIS2-backed ArcGIS Enterprise feature service the app creates from a selection of organisation units, data items, and periods. The data stays in DHIS2; the connection is a Custom Data Feed view over it.
_Avoid_: Service, Layer, Feature service (these are the underlying ArcGIS artifacts, not the user-facing concept)

**Portal item**:
The ArcGIS Enterprise catalog entry for a Connection (what search returns and what "View in ArcGIS" opens). One of the two artifacts behind every Connection.

**CDF service**:
The Custom Data Feed service registered on the hosting server (via `admin/services/createService`) that actually serves a Connection's data. The second artifact behind every Connection; removing a Connection deletes both the portal item and the CDF service.

**Preview**:
Creating a Connection's real feature service and inspecting it (map + attribute table) before committing. The user then keeps it or discards it; discarding deletes the just-created portal item and CDF service.
_Avoid_: Draft, Trial

**Resolves to**:
The concrete set of organisation units a selection expands to. A level or group selection (e.g. "District", "Hospitals") plus a boundary expands to many units; step 1 reports how many it resolves to so a mismatch is visible rather than silent.

**Mappable units**:
The organisation units in a selection that have geometry (points or polygons) and will appear on the map. Units without geometry become table-only rows. The resolves-to count is of mappable units.

**Boundary**:
The ancestor organisation unit(s) a level/group selection is evaluated under ("districts _under_ this boundary"). Defaults to the signed-in user's accessible roots when none is explicitly chosen.
