export const ACTIVATION_STATUS = {
  awaitingValidation: {
    name: 'awaitingValidation',
    type: 'warning',
  },
  beingActivated: {
    name: 'beingActivated',
    type: 'info',
  },
  beingDeactivated: {
    name: 'beingDeactivated',
    type: 'info',
  },
  migrating: {
    name: 'migrating',
    type: 'info',
  },
  cancelling: {
    name: 'cancelling',
    type: 'info',
  },
  disabled: {
    name: 'disabled',
    type: 'info',
  },
  enabled: {
    name: 'enabled',
    type: 'success',
  },
  enabling: {
    name: 'enabling',
    type: 'info',
  },
  inError: {
    name: 'inError',
    type: 'error',
  },
  needsConfiguration: {
    name: 'needsConfiguration',
    type: 'warning',
  },
  unknown: {
    name: 'unknown',
    type: 'info',
  },
};

ACTIVATION_STATUS.enabling = ACTIVATION_STATUS.beingActivated;
ACTIVATION_STATUS.disabling = ACTIVATION_STATUS.beingDeactivated;

export default {
  ACTIVATION_STATUS,
};
