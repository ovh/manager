import { TIMEOUT_MIN } from './proxy-form.constants';

export const isTimeoutValid = (timeout) =>
  timeout === 0 || timeout >= TIMEOUT_MIN;

export const durationToSeconds = (duration) =>
  typeof duration === 'string' ? moment.duration(duration).asSeconds() : 0;

export const secondsToDuration = (seconds) =>
  seconds ? moment.duration(seconds, 'seconds').toISOString() : null;

export default {
  isTimeoutValid,
  durationToSeconds,
  secondsToDuration,
};
