export const TRACKING_PREFIX = 'dedicated::ip::dashboard::order::';

export const IP_TYPE = {
  IPv4: 'ipv4',
  IPv6: 'ipv6',
};

export const IP_TYPE_TITLE = {
  IPv4: 'IPv4',
  IPv6: 'IPv6',
};

export const ADDITIONAL_IP = 'Additional IP';
export const ALERT_ID = 'ip.agora-order';
export const DASHBOARD_STATE_NAME = 'app.ip.dashboard';
export const IP_FAILOVER_PLANCODE = {
  EU: 'ip-failover-ripe',
  CA: 'ip-failover-arin',
  US: 'ip-failover-arin',
};

export const ALLOWED_LANGUAGES = {
  en: {
    isDefault: true,
  },
  fr: {
    isDefault: false,
  },
};

export const BASE_URL_SURVEY = 'https://survey.ovh.com/index.php/863655?lang=';

export default {
  ADDITIONAL_IP,
  TRACKING_PREFIX,
  IP_FAILOVER_PLANCODE,
  IP_TYPE_TITLE,
  DASHBOARD_STATE_NAME,
  IP_TYPE,
  ALERT_ID,
  ALLOWED_LANGUAGES,
  BASE_URL_SURVEY,
};
