import { FormatDurationOptions, formatDuration } from 'date-fns';

export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * parse ISO Duration
 * "P3D" -> { days: 3}
 */

export const parseISODuration = (duration: string): Duration => {
  const pattern = /^P(\d+Y)?(\d+M)?(\d+W)?(\d+D)?T?(\d+H)?(\d+M)?(\d+S)?/g;
  const matches = [...duration.matchAll(pattern)];

  const ISODuration = matches.reduce(
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

  return ISODuration;
};

/**
 * parse and format ISO Duration
 * "P3D" -> '3 days'
 */

export const parseAndFormatDuration = (duration: string, options: FormatDurationOptions) =>
  formatDuration(parseISODuration(duration), options);
