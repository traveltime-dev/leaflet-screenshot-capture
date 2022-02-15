import {
  MapContainer,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ children }) {
  return (
    <MapContainer
      center={[40.750580, -73.993584]}
      zoom={11}
      scrollWheelZoom
      zoomControl={false}
      style={{ height: '100vh', width: '100%' }}
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
