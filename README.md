# leaflet-screenshot-capture

This is a Next.js application using Leaflet map and TravelTime API to export images of traveltime isochrones during a defined time period.

## Configuration

So far the application is mostly hardcoded, if you wish to configure the following items you can update the code in: 

- Run duration - update `minutesInDay` const in `handler.jsx` `handleCapture` function
- Isochrone style - update `properties` in `isochroneMapper.js`
- Default map zoom and center - update map properties in `components/Map/index.js`
- API request - update `departure_searches` object in `isochrone.js` api route


# How to run

- npm install
- npm run dev
- browse localhost:3000
- Click 'Start capture' in top right corner to start a capture run

Use node 16 or above, application was not tested on prior versions.