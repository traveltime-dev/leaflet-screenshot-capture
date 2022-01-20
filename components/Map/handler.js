import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

function MapHandler(props) {
  const map = useMap();
  const { geojsonData, startingLocations } = props;
  const [geojsonRef, setGeojsonRef] = useState();

  useEffect(() => {
    if (geojsonData) {
      const obj = L.geoJSON(geojsonData, {
        style: (feat) => (feat?.properties),
      });
      const bounds = obj.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }
      if (geojsonRef) geojsonRef.remove();
      obj.addTo(map);
      setGeojsonRef(obj);
    }
  }, [geojsonData]);

  useEffect(() => {
    L.control.zoom({
      position: 'bottomright',
    }).addTo(map);
  }, []);

  return (
    <></>
  );
}

export default MapHandler;
