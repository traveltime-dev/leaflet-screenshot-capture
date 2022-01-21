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

  const getIsochronesResponse = async (timestamp) => fetch('/api/isochrone', {
    method: 'POST',
    body: JSON.stringify({ timestamp }),
  })
    .then((response) => response.json())
    .then((data) => data);

  const capture = async () => {
    const start = new Date();
    const minutesInDay = 1440;
    const minuteInMs = 60000;

    const screenshoter = new SimpleMapScreenshoter({
      hidden: true,
    });
    screenshoter.addTo(map);

    const dates = [];

    for (let i = 0; i <= minutesInDay; i += 1) {
      dates.push(new Date(start.getTime() + i * minuteInMs).toISOString());
    }

    for (const date of dates) {
      try {
        const res = await getIsochronesResponse(date);
        setGeojsonData(timeMapResponseToGeoJSON(res));
        const blob = await screenshoter.takeScreen('blob');
        FileSaver.saveAs(blob, `${date}.png`);
      } catch (error) {
        console.error(error);
      }
    }
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
    <button type="button" style={{ position: 'absolute', zIndex: 1000, right: 0 }} onClick={() => capture()}>Start capture</button>
  );
}

export default MapHandler;
