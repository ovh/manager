export const FORM_RULES = {
  name: {
    pattern: /^\w+$/,
    max: 256,
  },
  resolution: {
    pattern: /^\d+[smhdSMHD]$/,
    max: 4,
  },
  blockDataExpirationDuration: {
    pattern: /^\d+[smhdSMHD]$/,
    max: 4,
  },
  blockSizeDuration: {
    pattern: /^\d+[smhdSMHD]$/,
    max: 4,
  },
  bufferFutureDuration: {
    pattern: /^\d+[smhdSMHD]$/,
    max: 4,
  },
  bufferPastDuration: {
    pattern: /^\d+[smhdSMHD]$/,
    max: 4,
  },
  periodDuration: {
    pattern: /^\d+[smhdSMHD]$/,
    max: 4,
  },
};
export default {
  FORM_RULES,
};
