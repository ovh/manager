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

export function convertSecondsToTimeString(seconds: number) {
  if (seconds === 0) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const days = Math.floor(seconds / 86400);
  const leftoverSeconds = seconds % 86400;
  const hours = Math.floor(leftoverSeconds / 3600);
  const leftoverMinutes = leftoverSeconds % 3600;
  const minutes = Math.floor(leftoverMinutes / 60);

  const timeStringParts = [];
  if (days > 0) {
    timeStringParts.push(`${days}d`);
  }
  if (hours > 0) {
    timeStringParts.push(`${hours}h`);
  }
  if (minutes > 0) {
    timeStringParts.push(`${minutes}m`);
  }

  return timeStringParts.join(' ');
}
