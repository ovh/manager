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

export default {
  ACTIVATION_STATUS,
};
