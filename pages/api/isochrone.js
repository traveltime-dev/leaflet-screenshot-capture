import { randomBytes } from 'crypto';
import * as config from '../../config.json';
import { validateGtm } from '../../lib/utils';

const traveltimejs = require('traveltimejs');

process.env.TRAVELTIME_ID = '';
process.env.TRAVELTIME_KEY = '';

export default async function handler(req, res) {
  try {
    const { timestamp, traveltime } = JSON.parse(req.body);
    let departure;
    if (config.gmtModifier && validateGtm(config.gmtModifier)) {
      departure = `${timestamp.substring(0, timestamp.lastIndexOf('.'))}${config.gmtModifier}:00`;
    }
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
          departure_time: departure || timestamp,
        },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
}
