export const FRAUD_STATUS = {
  OK: 'ok',
  OPEN: 'open',
  REQUIRED: 'required',
};

export const FEATURES = {
  proceduresFraud: 'procedures:fraud',
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

export const SUPPORT_URL = 'https://help.ovhcloud.com/csm?id=csm_get_help';

export default {
  FRAUD_STATUS,
  SUPPORT_URL,
};
