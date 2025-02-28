export const ELIGIBLE_FOR_UPGRADE = {
  PLANCODE: '24rise02',
  SUBSIDIARIES: ['GB'],
};

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch2]',
  format: '[link]',
  generalPlacement: '[dedicated-server]',
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

export const UPGRADE_TYPE = {
  RAM: 'ram',
  STORAGE: 'storage',
};

export const RBX1_DATACENTER = 'RBX_1';

export default {
  ELIGIBLE_FOR_UPGRADE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  UPGRADE_TYPE,
  RBX1_DATACENTER,
};
