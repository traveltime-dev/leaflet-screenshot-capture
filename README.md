# leaflet-screenshot-capture

This is a Next.js application using Leaflet map and TravelTime API to export images of traveltime isochrones during a defined time period.

## Configuration

First, you need to set your traveltime api id and key in `isochrone.js`.

App can then be further configured via `config.json`.

- `coords` - map and marker center and request coords
- `resolution` - css height and width property strings in case you need to set a particular resolution. Will default to full screen if left empty.
- `zoom` - default map zoom level
- `mode` - changes capture mode. Should be either `"date"` or `"traveltime"`
- `startHour` - sets starting hour for api requests.
- `locationName` - location name used in `traveltime mode`
- `defaultTraveltime` - sets api request traveltime in `date` mode
- `colors` - object to configure your isochrone color via hex color codes
- `gmtModifier` - gmt date modifier between -11 and +14  add this if you wish to add time zone to your request, otherwise UTC will be used
- `isosConversionOffset` - modify this value depending on your local timezone to offset javascript isos date conversion for text displayed on screenshots, this does not impact api request.

# How to run

- npm install
- npm run dev
- browse localhost:3000
- Click 'Start capture' in top right corner to start a capture run

Use node 16 or above, application was not tested on prior versions.