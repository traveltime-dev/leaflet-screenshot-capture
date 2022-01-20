// Maps TravelTime API Time Map response to GeoJSON

const ringCoordsHashToArray = (ring) => (
  ring.map((latLng) => [latLng.lng, latLng.lat])
);

const timeMapResponseToGeoJSON = (response) => {
  const featureList = response.results.map((result) => {
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
};

export default timeMapResponseToGeoJSON;
