import { TimeRangeOption } from '../types/TimeRangeOption.type';

/**
 * Determine the window in seconds based on selectedTimeOption
 * @param timeRangeOption
 * @returns
 */
export const getWindowSecAndStep = (timeRangeOption: TimeRangeOption) => {
  const defaults = { windowSec: 60 * 60, stepSec: 60 };

  let windowSec: number = defaults.windowSec;
  let step: number = defaults.stepSec;

  // Ensure timeRangeOption and its value exist
  if (!timeRangeOption || !timeRangeOption.value) {
    console.warn('Invalid timeRangeOption provided, using defaults');
    return {
      windowSec: defaults.windowSec,
      step: defaults.stepSec,
    };
  }

  console.log(timeRangeOption.value);
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
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
