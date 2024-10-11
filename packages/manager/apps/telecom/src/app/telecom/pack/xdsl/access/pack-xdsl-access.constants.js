export const XDSL_NO_INCIDENT_CODE = 404;

export const XDSL_EXCHANGE_MODEM = {
  errBase: 'ERR0',
  errorCodeLast: 'ERR001',
  errorCodeRMA: 'ERR002',
  errorCodeSDSL: 'ERR004',
};

export const VDSL_PROFILE = {
  safe2: 'SNR 16',
  perf1: 'SNR 3',
  perf2: 'SNR 1',
};

export const MODEM_PROFILE = {
  standard: 'standard',
  orange: 'orange',
  bouygues: 'bouygues',
};

export const PROVIDER = {
  kosc: 'kosc',
  bouygues: 'bouygues',
};

export const PROVIDER_INFRA = {
  or: 'OR',
  orange: 'ORANGE',
};

export const ACCESS_TYPE = {
  vdsl: 'vdsl',
  ftth: 'ftth',
};

export const MAIL_SENDING_STATUS = {
  noStatus: 'noStatus',
  enabled: 'enabled',
  disabled: 'disabled',
  blockedForSpam: 'blockedForSpam',
};

// Need a long interval before making call again
export const POLLING_INTERVAL = 60000;

export const MAIL_SENDING_HELP =
  'https://help.ovhcloud.com/csm?id=csm_get_help';
export const MAIL_SENDING_GUIDE_URL =
  'https://help.ovhcloud.com/csm/fr-internet-access-enable-smtp?id=kb_article_view&sysparm_article=KB0064947';

export default {
  XDSL_NO_INCIDENT_CODE,
  XDSL_EXCHANGE_MODEM,
  VDSL_PROFILE,
  MODEM_PROFILE,
  PROVIDER,
  PROVIDER_INFRA,
  ACCESS_TYPE,
  MAIL_SENDING_STATUS,
  POLLING_INTERVAL,
  MAIL_SENDING_HELP,
  MAIL_SENDING_GUIDE_URL,
};
