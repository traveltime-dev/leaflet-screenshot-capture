import {
  MapContainer,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const Map = ({ children, styles }) => (
  <MapContainer
    center={[51.53605, -0.12513]}
    zoom={13}
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

export default Map;
