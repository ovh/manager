export const FRAUD_STATUS = {
  OK: 'ok',
  OPEN: 'open',
  REQUIRED: 'required',
};

const TRACK_IMPRESSION = {
  campaignId: 'kyc-fraud',
  creation: 'notification',
  format: 'banner',
  generalPlacement: 'manager-hub',
};

export const TRACK_IMPRESSION_OPEN = {
  ...TRACK_IMPRESSION,
  variant: 'open',
};

export const TRACK_IMPRESSION_REQUIRED = {
  ...TRACK_IMPRESSION,
  variant: 'required',
};

export default {
  FRAUD_STATUS,
};
