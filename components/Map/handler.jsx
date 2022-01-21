import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

function MapHandler(props) {
  const map = useMap();
  const { geojsonData } = props;
  const [geojsonRef, setGeojsonRef] = useState();

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
    L.control.zoom({
      position: 'bottomright',
    }).addTo(map);

    const screenshoter = new SimpleMapScreenshoter({});
    screenshoter.addTo(map);

    return () => {
      screenshoter.remove();
    };
  }, []);

  return (
    <></>
  );
}

export default MapHandler;
