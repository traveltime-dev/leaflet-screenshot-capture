import Head from 'next/head'
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('../components/Map'),
    { ssr: false },
  ), []);

  const MapHandler = useMemo(() => dynamic(
    () => import('../components/Map/handler'),
    { ssr: false },
  ), []);

  return (
    <div>
      <Head>
        <title>TravelTime Leaflet Screenshot Capture</title>
      </Head>

      <main>
        <Map>
          <MapHandler />
        </Map>
      </main>

    </div>
  )
}
