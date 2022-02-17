import { randomBytes } from 'crypto';
import * as config from '../../config.json';

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
            lat: config.coords.lat,
            lng: config.coords.lng,
          },
          transportation: {
            type: 'public_transport',
            walking_time: traveltime < 1500 ? traveltime : 1500,
          },
          travel_time: traveltime || config.defaultTraveltime,
          departure_time: gmtModifiedDate,
        },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
}
