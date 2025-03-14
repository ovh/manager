export * from './dnsconfig.constants';
export * from './form';

export const DATAGRID_REFRESH_INTERVAL = 5_000;
export const DATAGRID_REFRESH_ON_MOUNT = 'always';
export const FEATURE_FLAGS = {
  ALIAS: false,
  REDIRECTIONS: false,
  REDIRECTIONS_EDIT: false,
  AUTOREPLIES: false,
  MAILINGLISTS: false,
  DOMAIN_DIAGNOSTICS_SRV: false,
};

export const APIV2_MAX_PAGESIZE = 9999;
export const APIV2_DEFAULT_PAGESIZE = 25;
