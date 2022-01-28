import { randomBytes } from 'crypto';

const traveltimejs = require('traveltimejs');

process.env.TRAVELTIME_ID = 'cede9bfb';
process.env.TRAVELTIME_KEY = '8d8ba745bfe89933069cf7ec4b1b87ad';

export default async function handler(req, res) {
  try {
    const departure = JSON.parse(req.body).timestamp;
    const modified = `${departure.substring(0, departure.lastIndexOf('.'))}+05:00`;
    const result = await traveltimejs.time_map({
      departure_searches: [
        {
          id: randomBytes(16).toString('hex'),
          coords: {
            lat: 40.752655,
            lng: -73.977295,
          },
          transportation: {
            type: 'public_transport',
            walking_time: 1500,
          },
          travel_time: 3600,
          departure_time: modified,
        },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
}
