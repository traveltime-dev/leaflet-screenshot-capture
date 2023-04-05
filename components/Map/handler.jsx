import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import { screenshotByDate, screenshotByTraveltime } from '../../lib/screenshot';
import * as config from '../../config.json';

function MapHandler() {
  const map = useMap();
  const [geojsonRef, setGeojsonRef] = useState();
  const [geojsonData, setGeojsonData] = useState(null);
  const [mapTime, setMapTime] = useState();
  const [currentTraveltime, setCurrentTraveltime] = useState();
  const [captureInProgress, setCaptureInProgress] = useState(false);

  const getStartHours = (hours) => hours + config.isosConversionOffset;
  const startHours = getStartHours(config.startHour);

  const handleCapture = async () => {
    console.log('starting capture');
    setCaptureInProgress(true);

    const screenshoter = new SimpleMapScreenshoter({
      hidden: true,
    });
    screenshoter.addTo(map);

    const startDate = new Date();
    startDate.setHours(startHours, 0, 0);

    if (config.mode === 'date') {
      await screenshotByDate(map, screenshoter, setGeojsonData, setMapTime, startDate);
    } else if (config.mode === 'traveltime') {
      await screenshotByTraveltime(
        map,
        screenshoter,
        setGeojsonData,
        setCurrentTraveltime,
        startDate,
      );
    } else {
      console.error('invalid mode selected in config.json');
    }

    console.log('done capture');
    setCaptureInProgress(false);
  };

  useEffect(() => {
    if (geojsonData) {
      const obj = L.geoJSON(geojsonData, {
        style: (feat) => (feat?.properties),
      });
      if (geojsonRef) geojsonRef.remove();
      obj.addTo(map);
      setGeojsonRef(obj);
    }
  }, [geojsonData]);

  useEffect(() => {
    const markers = L.layerGroup();
    const marker = L.marker({ lat: config.coords.lat, lng: config.coords.lng }, {
      icon: L.icon({
        iconUrl: '/images/map_marker.svg',
        iconSize: [26, 37],
      }),
    });
    marker.addTo(markers);
    markers.addTo(map);
  }, []);

  return (
    <>
      {!captureInProgress
        && (
        <button
          type="button"
          style={{
            position: 'absolute',
            zIndex: 1000,
            right: 0,
          }}
          onClick={() => handleCapture()}
        >
          Start capture
        </button>
        )}
      {
          config.showLogo && (
            <div className="logo">
              <img
                src="/images/tt.png"
                alt="TravelTime logo"
              />
            </div>
          )
        }

      <div className="timestamp">
        <div>
          {mapTime}
        </div>
      </div>

      {
        (captureInProgress && config.mode === 'traveltime') && (
          <div className="reachable-minutes-text">
            <div>
              {` Where's reachable from ${config.locationName} within ${currentTraveltime} minutes`}
            </div>
          </div>
        )
      }
    </>
  );
}

export default MapHandler;
