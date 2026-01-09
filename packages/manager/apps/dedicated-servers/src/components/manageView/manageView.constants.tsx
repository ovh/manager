export const PREFERENCES_KEY = 'DATAGRID_VIEWS_CONFIG_DEDICATED_SERVERS';
export const STANDARD_VIEW_ID = 'standard-view';
export const MAX_VIEWS_NUMBER = 5;
export const DEFAULT_COLUMN_VISIBILITY: Record<string, boolean> = {
  serverId: false,
  'iam.displayName': true,
  ip: true,
  reverse: false,
  commercialRange: true,
  os: false,
  region: true,
  rack: false,
  datacenter: false,
  state: true,
  monitoring: false,
  vrack: false,
  renew: false,
  expiration: false,
  engagement: false,
  price: false,
  tags: true,
  actions: true,
};
