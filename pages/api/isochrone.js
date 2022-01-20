const traveltimejs = require('traveltimejs');

process.env['TRAVELTIME_ID'] = 'cede9bfb';
process.env['TRAVELTIME_KEY'] = '8d8ba745bfe89933069cf7ec4b1b87ad';

export default async function handler(req, res) {
  try {
    const result = await traveltimejs.time_map({
      departure_searches: [
        {
          id: 'lel',
          coords: {
            lat: 51.53605,
            lng: -0.12513
          },
          transportation: {
            type: "public_transport"
          },
          travel_time: 900,
          departure_time: new Date().toISOString()
        }
      ]
    });
    // console.log(result)
    res.status(200).json(result)
  } catch (error) {
    res.status(200).json(error)
  }
}
