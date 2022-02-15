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

const screenshotByDate = async (
  map,
  screenshoter,
  setGeojsonCb,
  setTimeCb,
  startDate,
) => {
  const minutesInDay = 1440;
  const minuteInMs = 60000;

  const dates = [];

  for (let i = 0; i < minutesInDay; i += 1) {
    dates.push(new Date(startDate.getTime() + i * minuteInMs));
  }

  for (const [index, date] of dates.entries()) {
    console.log(`date in client: ${date}`);
    try {
      const result = await getIsochronesResponse(date.toISOString());
      setGeojsonCb(timeMapResponseToGeoJSON(result, getPolygonFromBounds(map)));
      setTimeCb(getHoursAndMinutes(date));
      const blob = await screenshoter.takeScreen('blob');
      FileSaver.saveAs(blob, `image-${index + 1}.png`);
    } catch (error) {
      console.error(error);
    }
  }
};

const screenshotByTraveltime = async (
  map,
  screenshoter,
  setGeojsonCb,
  setTimeCb,
  startDate,
) => {
  const startDateIso = startDate.toISOString();
  const startMinutes = 5;
  const endMinutes = 60;

  (async function () {
    for await (const num of asyncMinuteGenerator(startMinutes, endMinutes)) {
      try {
        const result = await getIsochronesResponse(startDateIso, num.seconds);
        setGeojsonCb(timeMapResponseToGeoJSON(result, getPolygonFromBounds(map)));
        setTimeCb(num.increment);
        const blob = await screenshoter.takeScreen('blob');
        FileSaver.saveAs(blob, `image-${num.increment}.png`);
      } catch (error) {
        console.error(error);
      }
    }
  }());
};

export {
  screenshotByDate,
  screenshotByTraveltime,
};
