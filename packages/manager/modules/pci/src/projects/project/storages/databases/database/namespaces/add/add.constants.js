export const FORM_RULES = {
  name: {
    pattern: /^[a-zA-Z_0-9]+$/,
    max: 256,
  },
  resolution: {
    pattern: /^[0-9]+[smhdSMHD]$/,
    max: 4,
  },
  blockDataExpirationDuration: {
    pattern: /^[0-9]+[smhdSMHD]$/,
    max: 4,
  },
  blockSizeDuration: {
    pattern: /^[0-9]+[smhdSMHD]$/,
    max: 4,
  },
  bufferFutureDuration: {
    pattern: /^[0-9]+[smhdSMHD]$/,
    max: 4,
  },
  bufferPastDuration: {
    pattern: /^[0-9]+[smhdSMHD]$/,
    max: 4,
  },
  periodDuration: {
    pattern: /^[0-9]+[smhdSMHD]$/,
    max: 4,
  },
};
export default {
  FORM_RULES,
};
