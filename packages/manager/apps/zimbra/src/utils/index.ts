export * from './convertOctets';
export * from './dnsconfig.constants';
export * from './form';
export * from './date';

export const DATAGRID_REFRESH_INTERVAL = 5_000;
export const DATAGRID_REFRESH_ON_MOUNT = 'always';
export const FEATURE_FLAGS = {
  ALIAS: true,
  REDIRECTIONS: true,
  REDIRECTIONS_EDIT: false,
  AUTOREPLIES: true,
  MAILINGLISTS: true,
  DOMAIN_DIAGNOSTICS_SRV: false,
};

export const APIV2_MAX_PAGESIZE = 9999;
export const APIV2_DEFAULT_PAGESIZE = 25;
