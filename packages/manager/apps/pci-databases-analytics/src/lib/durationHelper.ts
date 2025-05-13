import { Duration, Locale, formatDuration } from 'date-fns';
import * as duration from 'duration-fns';

export function durationStringToHuman(durationString: string, locale: Locale) {
  return formatDuration(duration.parse(durationString), {
    locale,
    delimiter: ', ',
  });
}

export function durationStringToDuration(durationString: string) {
  const pattern = /(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(\d+H)?(\d+m)?(\d+S)?/g;
  const matches = [...durationString.matchAll(pattern)];

  const {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  } = matches.reduce(
    (acc, match) => {
      if (match[1]) acc.years += parseInt(match[1], 10);
      if (match[2]) acc.months += parseInt(match[2], 10);
      if (match[3]) acc.weeks += parseInt(match[3], 10);
      if (match[4]) acc.days += parseInt(match[4], 10);
      if (match[5]) acc.hours += parseInt(match[5], 10);
      if (match[6]) acc.minutes += parseInt(match[6], 10);
      if (match[7]) acc.seconds += parseInt(match[7], 10);
      return acc;
    },
    {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  );

  // Adjust total days based on weeks
  const totalDays = days + weeks * 7;

  return { years, months, days: totalDays, hours, minutes, seconds };
}

export function durationISOStringToShortTime(durationISOString: string) {
  const durationISO = duration.parse(durationISOString);

  let durationString = '';
  if (durationISO.years > 0) durationString += `${durationISO.years}Y`;
  if (durationISO.months > 0) durationString += `${durationISO.months}M`;
  if (durationISO.weeks > 0) durationString += `${durationISO.weeks}W`;
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

  const yearsPart = years > 0 ? `${years}Y` : '';
  const monthsPart = months > 0 ? `${months}M` : '';
  const daysPart = days > 0 ? `${days}D` : '';
  const timePart = hours > 0 || minutes > 0 || seconds > 0 ? 'T' : '';
  const hoursPart = hours > 0 ? `${hours}H` : '';
  const minutesPart = minutes > 0 ? `${minutes}M` : '';
  const secondsPart = seconds > 0 ? `${seconds}S` : '';

  const isoDuration = `P${yearsPart}${monthsPart}${daysPart}${timePart}${hoursPart}${minutesPart}${secondsPart}`;
  return isoDuration;
}

export function convertDurationStringToISODuration(durationTime: string) {
  return durationToISODurationString(durationStringToDuration(durationTime));
}

export function durationStringToSeconds(durationString: string) {
  const pattern = /(\d+Y)?(\d+M)?(\d+D)?(\d+W)?(\d+H)?(\d+m)?(\d+S)?/g;
  const matches = [...durationString.matchAll(pattern)];

  const timeUnits = [
    { unit: 'Y', factor: 31536000 }, // Year in seconds
    { unit: 'M', factor: 2628000 }, // Month in seconds
    { unit: 'D', factor: 86400 }, // Day in seconds
    { unit: 'W', factor: 604800 }, // Week in seconds
    { unit: 'H', factor: 3600 }, // Hour in seconds
    { unit: 'm', factor: 60 }, // Minute in seconds
    { unit: 'S', factor: 1 }, // Second in seconds
  ];

  let totalSeconds = 0;

  matches.forEach((match) => {
    timeUnits.forEach((timeUnit, index) => {
      if (match[index + 1]) {
        const value = parseInt(match[index + 1], 10);
        totalSeconds += value * timeUnit.factor;
      }
    });
  });

  return totalSeconds;
}
