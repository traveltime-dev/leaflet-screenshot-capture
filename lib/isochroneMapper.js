// Maps TravelTime API Time Map response to GeoJSON

const ringCoordsHashToArray = (ring) => (
  ring.map((latLng) => [latLng.lng, latLng.lat])
);

const getPolygonFromBounds = (map) => {
  const west = map.getBounds().getWest();
  const east = map.getBounds().getEast();
  const north = map.getBounds().getNorth();
  const south = map.getBounds().getSouth();

  return [
    [
      [
        east,
        north,
      ],
      [
        west,
        north,
      ],
      [
        west,
        south,
      ],
      [
        east,
        south,
      ],
    ],
  ];
};

// Returns a polygon alongside map bounds and removes isochrone shell to make holes
const timeMapResponseToGeoJSON = (response, bounds) => {
  const featureList = response.results.map((result) => {
    const shell = result.shapes.map((polygon) => ringCoordsHashToArray(polygon.shell));
    const coordinates = bounds.concat(shell);
    return {
      type: 'Feature',
      id: result.search_id,
      properties: {
        opacity: 0,
        fill: true,
        fillColor: '#38174f',
        color: '#38174f',
        fillOpacity: 0.5,
      },
      geometry: {
        type: 'Polygon',
        coordinates,
      },
    };
  });
  return {
    type: 'FeatureCollection',
    features: featureList,
  };
};

export {
  timeMapResponseToGeoJSON,
  getPolygonFromBounds,
};
