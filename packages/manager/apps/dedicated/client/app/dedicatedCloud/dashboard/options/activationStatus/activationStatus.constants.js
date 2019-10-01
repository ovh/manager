export const ACTIVATION_STATUS = {
  beingActivated: {
    name: 'beingActivated',
    type: 'warning',
  },
  beingDeactivated: {
    name: 'beingDeactivated',
    type: 'warning',
  },
  cancelling: {
    name: 'cancelling',
    type: 'warning',
  },
  disabled: {
    name: 'disabled',
    type: 'error',
  },
  enabled: {
    name: 'enabled',
    type: 'success',
  },
  needsConfiguration: {
    name: 'needsConfiguration',
    type: 'warning',
  },
  pendingActivation: {
    name: 'pendingActivation',
    type: 'error',
  },
  unknown: {
    name: 'unknown',
    type: 'info',
  },
};

export default {
  ACTIVATION_STATUS,
};
