export const MINIMUM_VOLUME_SIZE = 100;
export const SERVICE_TYPE = 'NETAPP';

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch1]',
  format: '[link]',
  generalPlacement: '[netapp]',
  detailedPlacement: '[commitment]',
};

export const COMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[commit]',
};

export const RECOMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[recommit]',
};

export const NETWORK_STATUS = {
  TO_CONFIGURE: 'to_configure',
  ASSOCIATING: 'associating',
  ASSOCIATED: 'associated',
  DISSOCIATING: 'dissociating',
};

export const VRACK_SERVICES_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  DISABLED: 'DISABLED',
};

export const POLLING_TYPE = {
  ASSOCIATING: 'associating',
  DISSOCIATING: 'dissociating',
};

export const FETCH_INTERVAL = 5000;

export default {
  MINIMUM_VOLUME_SIZE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  NETWORK_STATUS,
  FETCH_INTERVAL,
  POLLING_TYPE,
  VRACK_SERVICES_STATUS,
};
