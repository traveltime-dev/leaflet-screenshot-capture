/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import FileSaver from 'file-saver';
import { timeMapResponseToGeoJSON, getPolygonFromBounds } from '../../lib/isochroneMapper';

function MapHandler() {
  const map = useMap();
  const [geojsonRef, setGeojsonRef] = useState();
  const [geojsonData, setGeojsonData] = useState(null);
  const [mapTime, setMapTime] = useState();
  const [captureInProgress, setCaptureInProgress] = useState(false);

  const getHoursAndMinutes = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (minutes < 10) return `${hours}:0${minutes}`;
    return `${hours}:${minutes}`;
  };

  const getIsochronesResponse = async (timestamp) => fetch('/api/isochrone', {
    method: 'POST',
    body: JSON.stringify({ timestamp }),
  })
    .then((response) => response.json())
    .then((data) => data);

  const handleCapture = async () => {
    console.log('starting capture');
    setCaptureInProgress(true);

    const start = new Date();
    const minutesInDay = 1440;
    const minuteInMs = 60000;

    const screenshoter = new SimpleMapScreenshoter({
      hidden: true,
    });
    screenshoter.addTo(map);

    const dates = [];

    for (let i = 0; i < minutesInDay; i += 1) {
      dates.push(new Date(start.getTime() + i * minuteInMs));
    }

    for (const [index, date] of dates.entries()) {
      try {
        console.log(`processing entry #${index + 1} out of ${dates.length}`);
        const res = await getIsochronesResponse(date.toISOString());
        setGeojsonData(timeMapResponseToGeoJSON(res, getPolygonFromBounds(map)));
        setMapTime(getHoursAndMinutes(date));
        const blob = await screenshoter.takeScreen('blob');
        FileSaver.saveAs(blob, `image-${index + 1}.png`);
      } catch (error) {
        console.error(error);
      }
    }
    setCaptureInProgress(false);
    console.log('capture complete');
  };

  useEffect(async () => {
    if (geojsonData) {
      const obj = L.geoJSON(geojsonData, {
        style: (feat) => (feat?.properties),
      });
      if (geojsonRef) geojsonRef.remove();
      obj.addTo(map);
      setGeojsonRef(obj);
    }
  }, [geojsonData]);

  useEffect(async () => {
    try {
      const isochrones = await getIsochronesResponse(new Date().toISOString());
      setGeojsonData(timeMapResponseToGeoJSON(isochrones, getPolygonFromBounds(map)));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      {!captureInProgress
        && <button type="button" style={{ position: 'absolute', zIndex: 1000, right: 0 }} onClick={() => handleCapture()}>Start capture</button>}
          
      <div className="logo">
        <img
          src="/images/tt.png"
          alt="TravelTime logo"
        />
      </div>
      <div className="timestamp">
        {mapTime}
      </div>
    </>
  );
}

export default MapHandler;
