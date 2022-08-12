export const PREFIX_TRACKING_DASHBOARD = 'dashboard';

export const PREFIX_TRACKING_DASHBOARD_PARTITIONS = `${PREFIX_TRACKING_DASHBOARD}::nasha-partitions`;

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch2]',
  format: '[link]',
  generalPlacement: '[nasha]',
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

export default {
  PREFIX_TRACKING_DASHBOARD,
  PREFIX_TRACKING_DASHBOARD_PARTITIONS,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
};
