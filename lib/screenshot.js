/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

import FileSaver from 'file-saver';
import getIsochronesResponse from './service';
import { timeMapResponseToGeoJSON, getPolygonFromBounds } from './isochroneMapper';
import getHoursAndMinutes from './utils';

async function* asyncMinuteGenerator(startMinute, endMinute) {
  const startSeconds = startMinute * 60;
  let i = startMinute - 1;
  while (i < endMinute * 60) {
    yield {
      seconds: startSeconds + (60 * i),
      increment: i += 1,
    };
  }
}

const incrementDate = async (setGeojsonCb, map, setTimeCb, screenshoter, startHours) => {
  const minutesInDay = 1440;
  const minuteInMs = 60000;

  const start = new Date();
  if (startHours) {
    start.setHours(startHours, 0, 0);
  }

  const dates = [];

  for (let i = 0; i < minutesInDay; i += 1) {
    dates.push(new Date(start.getTime() + i * minuteInMs));
  }

  for (const [index, date] of dates.entries()) {
    console.log(`date in client: ${date}`);
    try {
      console.log(`processing entry #${index + 1} out of ${dates.length}`);
      const res = await getIsochronesResponse(date.toISOString());
      setGeojsonCb(timeMapResponseToGeoJSON(res, getPolygonFromBounds(map)));
      setTimeCb(getHoursAndMinutes(date));
      const blob = await screenshoter.takeScreen('blob');
      FileSaver.saveAs(blob, `image-${index + 1}.png`);
    } catch (error) {
      console.error(error);
    }
  }
};

const incrementTraveltime = async (setGeojsonCb, map, setTimeCb, screenshoter, startHours) => {
  const startMinutes = 5;
  const endMinutes = 60;

  const start = new Date();
  if (startHours) {
    start.setHours(startHours, 0, 0);
  }

  (async function () {
    for await (const num of asyncMinuteGenerator(startMinutes, endMinutes)) {
      const res = await getIsochronesResponse(start.toISOString(), num.seconds);
      setGeojsonCb(timeMapResponseToGeoJSON(res, getPolygonFromBounds(map)));
      setTimeCb(num.increment);
      const blob = await screenshoter.takeScreen('blob');
      FileSaver.saveAs(blob, `image-${num.increment}.png`);
    }
  }());
};

export {
  incrementDate,
  incrementTraveltime,
};
