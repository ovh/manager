export const COMPOSITE_UPGRADE = 'composite';
export const MIN_INTERVENTION_GAP = 11;
// UPGRADE_MODE.SCHEDULE is used in the schedule route. If you change this,
// communicate to the backend team so that they update the email with the modified link
export const UPGRADE_MODE = {
  ORDER: 'order',
  SCHEDULE: 'schedule',
  NONE: 'none',
};

export default {
  COMPOSITE_UPGRADE,
  MIN_INTERVENTION_GAP,
  UPGRADE_MODE,
};
