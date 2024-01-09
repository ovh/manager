export const TRACKING_SUFFIX = {
  ADD_HOST: '::add-host',
  ORDER_HOST: '::add-storage',
  CONFIRM: '::confirm',
  CONFIRM_SUCCESS: '::nsx-success',
  CONFIRM_ERROR: '::nsx-error',
};

export const NSX_RESOURCES = {
  MEDIUM: {
    cpu: 4,
    storage: 200,
    ram: 8,
  },
  LARGE: {
    cpu: 8,
    storage: 200,
    ram: 32,
  },
  XLARGE: {
    cpu: 16,
    storage: 200,
    ram: 32,
  },
};

export default {
  TRACKING_SUFFIX,
  NSX_RESOURCES,
};
