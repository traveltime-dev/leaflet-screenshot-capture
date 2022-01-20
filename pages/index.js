import Head from 'next/head'
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('../components/Map'),
    { ssr: false },
  ), []);

  const MapHandler = useMemo(() => dynamic(
    () => import('../components/Map/handler'),
    { ssr: false },
  ), []);

  const handleClick = async () => {
    fetch('/api/isochrone')
      .then(response => response.json())
      .then(data => setGeoData(data));
  }

  const getIsochronesResponse = async () => {
    return fetch('/api/isochrone')
      .then(response => response.json())
      .then(data => data);
  }

  const ringCoordsHashToArray = (ring) => (
    ring.map((latLng) => [latLng.lng, latLng.lat])
  );

  const parseResponse = (response) => {
    const fixedOrderResults = response.results;
    const findUnordedItem = fixedOrderResults
      .findIndex((result) => result.search_id
        .includes('intersections') || result.search_id.includes('union'));
    const unionOrIntersectionExists = findUnordedItem > -1;
    if (unionOrIntersectionExists) {
      fixedOrderResults.push(fixedOrderResults.splice(findUnordedItem, 1)[0]);
    }
    const featureList = fixedOrderResults.map((result) => {
      const multiPolygon = result.shapes.map((polygon) => {
        const shell = ringCoordsHashToArray(polygon.shell);
        const holes = polygon.holes.map(ringCoordsHashToArray);
        return [shell].concat(holes);
      });
      return {
        type: 'Feature',
        id: result.search_id,
        properties: {
          fillColor: 'red',
          // weight: unionOrIntersectionExists ? (featureIsUnionOrIntersection ? 2 : 1) : 2,
          // opacity: unionOrIntersectionExists ? (featureIsUnionOrIntersection ? 1 : 0.3) : 1,
          color: 'red',
          fillOpacity: 0.5,
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: multiPolygon,
        },
      };
    });
    return {
      type: 'FeatureCollection',
      features: featureList,
    };

  }

  const [geoData, setGeoData] = useState(null);

  useEffect(async () => {
    const isochrones = await getIsochronesResponse()
    console.log(parseResponse(isochrones))
    setGeoData(parseResponse(isochrones))
  }, [])

  return (
    <div>
      <Head>
        <title>TravelTime Leaflet Screenshot Capture</title>
      </Head>

      <main>
        <button onClick={() => handleClick()}>trac</button>
        <Map>
          <MapHandler geojsonData={geoData} />
        </Map>
      </main>

    </div>
  )
}
