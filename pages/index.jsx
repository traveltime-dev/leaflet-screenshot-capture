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

  const getIsochronesResponse = async () => fetch('/api/isochrone')
    .then((response) => response.json())
    .then((data) => data);

  const [geoData, setGeoData] = useState(null);
  useEffect(async () => {
    const isochrones = await getIsochronesResponse();
    setGeoData(timeMapResponseToGeoJSON(isochrones));
  }, []);

  return (
    <div>
      <Head>
        <title>TravelTime Leaflet Screenshot Capture</title>
      </Head>

      <main>
        <Map>
          <MapHandler geojsonData={geoData} />
        </Map>
      </main>

    </div>
  );
}
