const getIsochronesResponse = async (timestamp, traveltime) => fetch('/api/isochrone', {
  method: 'POST',
  body: JSON.stringify({ timestamp, traveltime }),
})
  .then((response) => response.json())
  .then((data) => data);

export default getIsochronesResponse;
