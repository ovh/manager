// UPGRADE_MODE.SCHEDULE is used in the schedule route. If you change this,
// communicate to the backend team so that they update the email with the modified link
export const UPGRADE_MODE = {
  ORDER: 'order',
  SCHEDULE: 'schedule',
  NONE: 'none',
};

export const DEFAULT_INTERVAL = 1;

export default {
  DEFAULT_INTERVAL,
  UPGRADE_MODE,
};
