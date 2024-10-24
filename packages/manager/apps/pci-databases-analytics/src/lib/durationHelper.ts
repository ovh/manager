import { Duration, Locale, formatDuration } from 'date-fns';
import * as duration from 'duration-fns';

export function durationStringToHuman(durationString: string, locale: Locale) {
  return formatDuration(duration.parse(durationString), {
    locale,
    delimiter: ', ',
  });
}

export function durationStringToDuration(durationString: string) {
  // Regular expression to match the duration parts
  const pattern = /(\d+Y)?(\d+M)?(\d+D)?(\d+H)?(\d+m)?(\d+S)?/;
  const matches = pattern.exec(durationString);

  // Convert matched values to numbers, defaulting to 0 if not present
  const years = matches[1] ? parseInt(matches[1], 10) : 0;
  const months = matches[2] ? parseInt(matches[2], 10) : 0;
  const days = matches[3] ? parseInt(matches[3], 10) : 0;
  const hours = matches[4] ? parseInt(matches[4], 10) : 0;
  const minutes = matches[5] ? parseInt(matches[5], 10) : 0;
  const seconds = matches[6] ? parseInt(matches[6], 10) : 0;
  // Construct and return the duration object
  return { years, months, days, hours, minutes, seconds };
}

export function durationISOStringToShortTime(durationISOString: string) {
  let durationString = '';
  const durationISO = duration.parse(durationISOString);
  if (durationISO.years > 0) durationString += `${durationISO.years}Y`;
  if (durationISO.months > 0) durationString += `${durationISO.months}M`;
  if (durationISO.days > 0) durationString += `${durationISO.days}D`;
  if (durationISO.hours > 0) durationString += `${durationISO.hours}H`;
  if (durationISO.minutes > 0) durationString += `${durationISO.minutes}m`;
  if (durationISO.seconds > 0) durationString += `${durationISO.seconds}S`;
  return durationString;
}

export function durationToISODurationString(durationTime: Duration) {
  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = durationTime;

  // Construct the duration string part by part
  const yearsPart = years > 0 ? `${years}Y` : '';
  const monthsPart = months > 0 ? `${months}M` : '';
  const daysPart = days > 0 ? `${days}D` : '';
  const timePart = hours > 0 || minutes > 0 || seconds > 0 ? 'T' : '';
  const hoursPart = hours > 0 ? `${hours}H` : '';
  const minutesPart = minutes > 0 ? `${minutes}M` : '';
  const secondsPart = seconds > 0 ? `${seconds}S` : '';

  // Combine all parts to form the full ISO 8601 duration string
  const isoDuration = `P${yearsPart}${monthsPart}${daysPart}${timePart}${hoursPart}${minutesPart}${secondsPart}`;
  return isoDuration;
}

export function convertDurationStringToISODuration(durationTime: string) {
  return durationToISODurationString(durationStringToDuration(durationTime));
}

export function durationStringToSeconds(durationString: string) {
  const pattern = /(\d+Y)?(\d+M)?(\d+D)?(\d+H)?(\d+m)?(\d+S)?/;
  const matches = pattern.exec(durationString);

  const timeUnits = [
    { unit: 'Y', factor: 31536000 }, // Year in seconds
    { unit: 'M', factor: 2628000 }, // Month in seconds
    { unit: 'D', factor: 86400 }, // Day in seconds
    { unit: 'H', factor: 3600 }, // Hour in seconds
    { unit: 'm', factor: 60 }, // Minute in seconds
    { unit: 'S', factor: 1 }, // Second in seconds
  ];

  let totalSeconds = 0;

  timeUnits.forEach((timeUnit, index) => {
    const value = matches[index + 1] ? parseInt(matches[index + 1], 10) : 0;
    totalSeconds += value * timeUnit.factor;
  });

  return totalSeconds;
}
