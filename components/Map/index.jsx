import {
  MapContainer,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as config from '../../config.json';

function Map({ children }) {
  return (
    <MapContainer
      center={[config.coords.lat, config.coords.lng]}
      zoom={config.zoom}
      scrollWheelZoom
      zoomControl={false}
      style={{
        height: config.resolution.height || '100vh',
        width: config.resolution.width || '100%',
      }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> | Created with <a href="http://traveltime.com" target="_blank">TravelTime API</a>'
        url="https://tiles.traveltime.com/lux/{z}/{x}/{y}.png?key=c3cb34db"
      />
      {children}
    </MapContainer>
  );
}

export default Map;
