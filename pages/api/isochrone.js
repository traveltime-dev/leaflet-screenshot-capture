import { randomBytes } from 'crypto';

const traveltimejs = require('traveltimejs');

process.env.TRAVELTIME_ID = 'cede9bfb';
process.env.TRAVELTIME_KEY = '8d8ba745bfe89933069cf7ec4b1b87ad';

export default async function handler(req, res) {
  try {
    const { timestamp, traveltime } = JSON.parse(req.body);
    const gmtModifiedDate = `${timestamp.substring(0, timestamp.lastIndexOf('.'))}+05:00`;
    const result = await traveltimejs.time_map({
      departure_searches: [
        {
          id: randomBytes(16).toString('hex'),
          coords: {
            lat: 40.750580,
            lng: -73.993584,
          },
          transportation: {
            type: 'public_transport',
            walking_time: traveltime < 1500 ? traveltime : 1500,
          },
          travel_time: traveltime || 3600,
          departure_time: gmtModifiedDate,
        },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
}
