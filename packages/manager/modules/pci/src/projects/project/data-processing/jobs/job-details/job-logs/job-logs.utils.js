import moment from 'moment';

/**
 * Formats a date to its ISO representation with a fixed padding
 * @param dt date
 * @param padding int padding to apply
 * @return {*}
 */
export const formatLogsDate = (dt, padding = 25) => {
  return moment(dt / 1000000)
    .toISOString()
    .padEnd(padding, ' ');
};

export default {
  formatLogsDate,
};
