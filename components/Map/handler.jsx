/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import { timeMapResponseToGeoJSON, getPolygonFromBounds } from '../../lib/isochroneMapper';
import { incrementDate, incrementTraveltime } from '../../lib/screenshot';
import getIsochronesResponse from '../../lib/service';

function MapHandler() {
  const map = useMap();
  const [geojsonRef, setGeojsonRef] = useState();
  const [geojsonData, setGeojsonData] = useState(null);
  const [mapTime, setMapTime] = useState();
  const [currentTraveltime, setCurrentTraveltime] = useState();
  const [captureInProgress, setCaptureInProgress] = useState(false);

  const getStartHours = (hours) => hours + 2; // offset Isos conversion
  const startHours = getStartHours(18);

  const handleCapture = async () => {
    console.log('starting capture');
    setCaptureInProgress(true);

    const screenshoter = new SimpleMapScreenshoter({
      hidden: true,
    });
    screenshoter.addTo(map);

    // TODO add logic to config between

    await incrementDate(setGeojsonData, map, setMapTime, screenshoter, startHours);
    // await incrementTraveltime(setGeojsonData, map, setCurrentTraveltime, screenshoter, startHours);

    console.log('done capture');
    setCaptureInProgress(false);
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
    const markers = L.layerGroup();
    const marker = L.marker({ lat: 40.750580, lng: -73.993584 }, {
      icon: L.icon({
        iconUrl: '/images/map_marker.svg',
        iconSize: [26, 37],
      }),
    });
    marker.addTo(markers);
    markers.addTo(map);

    try {
      const start = new Date();
      start.setHours(startHours, 0, 0);
      const isochrones = await getIsochronesResponse(
        start.toISOString(),
      );
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
        <div>
          {mapTime}
        </div>
      </div>

      {/* {
        captureInProgress && (
          <div className="reachable-minutes-text">
            <div>
              {` Where's reachable from Penn Station within ${currentTraveltime} minutes`}
            </div>
          </div>
        )
      } */}
    </>
  );
}

export default MapHandler;
