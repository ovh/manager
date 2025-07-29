export function displayDuration(duration: string) {
  const regex = /([0-9]+[mdjya]?|uptoFirstDayNextMonth|upto-[0-9]{4}-[0-9]{2}-[0-9]{2})/;

  const durationObj = {
    duration,
    date: new Date(),
  };

  if (!regex.test(duration)) {
    return durationObj;
  }

  const durationMatch = regex.exec(duration);

  if (durationMatch[1] && durationMatch[1]?.startsWith('up-to')) {
    durationObj.date = new Date(durationMatch[1].substring(5));
  }

  const dateMatch = /([0-9]+)([mdjya]{0,1})/g.exec(durationMatch[1]);
  const dateValue = parseInt(dateMatch[1], 10);
  const dateUnit = dateMatch[2];

  durationObj.date = new Date();

  if (dateUnit === 'd' || dateUnit === 'j') {
    durationObj.date.setDate(durationObj.date.getDate() + dateValue);
  } else if (dateUnit === 'y' || dateUnit === 'a') {
    durationObj.date.setFullYear(durationObj.date.getFullYear() + dateValue);
  } else {
    durationObj.date.setMonth(durationObj.date.getMonth() + dateValue);
  }

  return durationObj;
}
