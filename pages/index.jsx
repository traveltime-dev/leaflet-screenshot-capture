import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import timeMapResponseToGeoJSON from '../lib/isochroneMapper';

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('../components/Map'),
    { ssr: false },
  ), []);

  const MapHandler = useMemo(() => dynamic(
    () => import('../components/Map/handler'),
    { ssr: false },
  ), []);

  const getIsochronesResponse = async (timestamp) => fetch('/api/isochrone', {
    method: 'POST',
    body: JSON.stringify({ timestamp }),
  })
    .then((response) => response.json())
    .then((data) => data);

  const [geoData, setGeoData] = useState(null);
  useEffect(async () => {
    try {
      const isochrones = await getIsochronesResponse(new Date().toISOString());
      setGeoData(timeMapResponseToGeoJSON(isochrones));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const capture = async () => {
    const start = new Date();
    const minutesInDay = 1440;
    const minuteInMs = 60000;

    const dates = [];

    for (let i = 0; i < minutesInDay + 1; i += 1) {
      dates.push(new Date(start.getTime() + i * minuteInMs).toISOString());
    }

    let failures = 0;
    const captureBtn = document.querySelector('.leaflet-control-simpleMapScreenshoter-btn');
    dates.forEach(async (date) => {
      try {
        const res = await getIsochronesResponse(date);
        setGeoData(timeMapResponseToGeoJSON(res));
        await captureBtn.click();
      } catch (error) {
        console.error(error);
        failures += 1;
        console.log(failures);
      }
    });
  };

  return (
    <div>
      <Head>
        <title>TravelTime Leaflet Screenshot Capture</title>
      </Head>

      <main>
        <button style={{ position: 'absolute', zIndex: 1000, right: 0 }} onClick={() => capture()}>Start capture</button>
        <Map>
          <MapHandler geojsonData={geoData} />
        </Map>
      </main>

    </div>
  );
}
