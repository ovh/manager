import { Locale, formatDate, getUnixTime, setHours, setMinutes, setSeconds } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';

import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

import { TimeRangeOption } from '@/types/TimeRangeOption.type';

/**
 * Determine the window in seconds based on selectedTimeOption
 * @param timeRangeOption
 * @returns
 */
export const getWindowSecAndStep = (timeRangeOption: TimeRangeOption) => {
  const defaults = { windowSec: 60 * 60, stepSec: 60 };

  let { windowSec } = defaults;
  let step: number = defaults.stepSec;

  // Ensure timeRangeOption and its value exist
  if (!timeRangeOption || !timeRangeOption.value) {
    console.warn('Invalid timeRangeOption provided, using defaults');
    return {
      windowSec: defaults.windowSec,
      step: defaults.stepSec,
    };
  }

  switch (timeRangeOption.value) {
    case '1h': {
      windowSec = 60 * 60; // 1 hour
      step = 60; // 1-minute step
      break;
    }
    case '12h': {
      windowSec = 12 * 60 * 60; // 12 hours
      step = 60; // 1-minute step
      break;
    }
    case '24h': {
      windowSec = 24 * 60 * 60; // 12 hours
      step = 60; // 1-minute step
      break;
    }
    case 'custom': {
      windowSec = 24 * 60 * 60; // 1 day
      step = 60; // 10-minute step
      break;
    }
    default: {
      windowSec = defaults.windowSec;
      step = defaults.stepSec;
      break;
    }
  }

  return {
    windowSec,
    step,
  };
};

export const formatTimeFromDate = (value?: string | Date): string => {
  const date = value ? new Date(value) : new Date();
  return formatDate(date, 'HH:mm:ss');
};

/**
 * Format a Unix timestamp (in seconds) into a human-readable date time string
 * @param timestampInSeconds - Unix timestamp in seconds
 * @returns Formatted date time string (yyyy-MM-dd HH:mm:ss)
 */
export const formatDateTime = (timestampInSeconds: number): string => {
  return formatDate(new Date(timestampInSeconds * 1000), 'yyyy-MM-dd HH:mm:ss');
};

/**
 * Calculate start and end date times based on a time range option
 * @param timeOption - The selected time range option
 * @param providedEndDateTime - Optional end date time (in seconds). If not provided, uses current time
 * @param providedStartDateTime - Optional start date time (in seconds). If not provided, calculates from endDateTime and rangeInSeconds
 * @returns Object containing startDateTime and endDateTime (both in seconds)
 */
export const calculateDateTimeRange = (
  timeOption: TimeRangeOption,
  providedEndDateTime?: number,
  providedStartDateTime?: number,
): { startDateTime: number; endDateTime: number } => {
  const endDateTime = providedEndDateTime ?? Math.floor(Date.now() / 1000);
  const startDateTime = providedStartDateTime ?? endDateTime - timeOption.rangeInSeconds;
  return { startDateTime, endDateTime };
};

/**
 * Calculate a Unix timestamp in seconds by combining a date with a time string
 * @param date - The date to combine with the time
 * @param time - Time string in HH:mm:ss format
 * @returns Unix timestamp in seconds
 */
export const calculateTimestamp = (date: Date | null, time: string): number => {
  if (!date) {
    return getUnixTime(new Date());
  }

  const [hours, minutes, seconds] = time.split(':').map(Number);
  const combinedDate = setSeconds(
    setMinutes(setHours(date, hours || 0), minutes || 0),
    seconds || 0,
  );

  return getUnixTime(combinedDate);
};

/**
 * Get date-fns locale object from a locale string (e.g., 'fr_FR' -> fr locale)
 * @param locale - Optional locale string (e.g., 'fr_FR', 'en_GB')
 * @returns date-fns Locale object or fallback locale if no is provided
 */
export const getLocaleObject = (locale?: string): Locale => {
  const fallbackLocale = dateFnsLocales.fr;
  if (!locale) {
    return fallbackLocale;
  }

  try {
    const userLocale = getDateFnsLocale(locale);
    const localeObject = dateFnsLocales[userLocale as keyof typeof dateFnsLocales];
    return localeObject || fallbackLocale;
  } catch {
    return fallbackLocale;
  }
};
