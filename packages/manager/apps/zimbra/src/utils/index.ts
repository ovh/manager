export * from './dnsconfig.constants';
export * from './form';
export * from './url';
export * from './string';
export * from './promise';
export * from './object';

export const DATAGRID_REFRESH_INTERVAL = 5_000;
export const DATAGRID_REFRESH_ON_MOUNT = 'always';
export const FEATURE_FLAGS = {
  REDIRECTIONS: false,
  REDIRECTIONS_EDIT: false,
  AUTOREPLIES: false,
  MAILINGLISTS: false,
  DOMAIN_DIAGNOSTICS_SRV: false,
};

export const APIV2_MAX_PAGESIZE = 9999;
export const APIV2_DEFAULT_PAGESIZE = 25;

export const ONBOARDED_KEY = 'zimbra_onboarded';

export const isOnboarded = () => {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
};

export const setOnboarded = (state = 'true') => {
  return localStorage.setItem(ONBOARDED_KEY, state);
};
