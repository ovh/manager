const MIN_TO_SEC = 60;
const HOUR_TO_SEC = 3600;
const DAY_TO_SEC = 86400;

export const stringToDuration = function(string, pattern = /^\d+[smhdSMHD]$/g) {
  if (!string) {
    return null;
  }
  const match = string.match(pattern);
  if (!match) {
    return null;
  }
  const value = parseInt(string.slice(0, -1), 10);
  const unit = string[string.length - 1];
  switch (unit.toLowerCase()) {
    case 's':
      return moment.duration(value, 'seconds');
    case 'm':
      return moment.duration(value, 'minutes');
    case 'h':
      return moment.duration(value, 'hours');
    case 'd':
      return moment.duration(value, 'days');
    default:
      return null;
  }
};

export const durationStringToString = function(durationSting) {
  const duration = moment.duration(durationSting);
  const seconds = duration.asSeconds();
  if (seconds === 0) {
    return null;
  }
  if (seconds % DAY_TO_SEC === 0) {
    return `${seconds / DAY_TO_SEC}d`;
  }
  if (seconds % HOUR_TO_SEC === 0) {
    return `${seconds / HOUR_TO_SEC}h`;
  }
  if (seconds % MIN_TO_SEC === 0) {
    return `${seconds / MIN_TO_SEC}m`;
  }
  return `${seconds}s`;
};

export default {
  stringToDuration,
  durationStringToString,
};
