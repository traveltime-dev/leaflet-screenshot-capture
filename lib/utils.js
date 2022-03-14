const getHoursAndMinutes = (date) => {
  const hours = date.getHours() - 2; // offset +2 GMT
  // quick fix start
  let fixedHours = hours;
  if (fixedHours === -2) fixedHours = 22;
  if (fixedHours === -1) fixedHours = 23;
  const displayHours = fixedHours < 10 ? `0${fixedHours}` : fixedHours;
  // quick fix end
  // const displayHours = hours < 10 ? `0${hours}` : hours;
  const minutes = date.getMinutes();
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes}`;
};

export const validateGtm = (modifier) => modifier <= 14 && modifier >= -11;

export default getHoursAndMinutes;
