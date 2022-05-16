export const STATE_NAME = 'nasha.dashboard.partitions';
export const INSTANCE_STATE_NAME = `${STATE_NAME}.partition`;
export const MAX_PARTITIONS = 10;

export const INSTANCE_STATE_RESOLVE = {
  breadcrumb: () => null,
  close: /* @ngInject */ (goBack) => ({ success, error } = {}) =>
    goBack({ success, error, stateName: STATE_NAME }),
};

export default {
  INSTANCE_STATE_NAME,
  INSTANCE_STATE_RESOLVE,
  MAX_PARTITIONS,
  STATE_NAME,
};
