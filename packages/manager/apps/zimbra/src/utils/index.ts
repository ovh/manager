export * from './convertOctets';
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
  DOMAIN_DIAGNOSTICS: false,
  DOMAIN_DNS_CONFIGURATION: false,
  DOMAIN_NOT_OVH: false,
  ORDER: false,
};
