# leaflet-screenshot-capture

This is a Next.js application using Leaflet map and TravelTime API to export images of traveltime isochrones during a defined time period.

## Configuration

App can be configured via `config.json`.

- `coords` - map and marker center and request coords
- `resolution` - css height and width property strings in case you need to set a particular resolution. Will default to full screen if left empty.
- `zoom` - default map zoom level
- `mode` - changes capture mode. Should be either `"date"` or `"traveltime"`
- `startHour` - sets starting hour for api requests.
- `locationName` - location name used in `traveltime mode`
- `defaultTraveltime` - sets api request traveltime in `date` mode

# How to run

- npm install
- npm run dev
- browse localhost:3000
- Click 'Start capture' in top right corner to start a capture run

Use node 16 or above, application was not tested on prior versions.