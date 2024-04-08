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

export default {
  ADDITIONAL_IP,
  TRACKING_PREFIX,
  IP_FAILOVER_PLANCODE,
<<<<<<< HEAD
  IP_TYPE_TITLE,
  DASHBOARD,
=======
  DASHBOARD_STATE_NAME,
>>>>>>> 145ef4557b (feat(dedicated): rename DASHBOARD const and use data-xxx attributes)
  IP_TYPE,
  ALERT_ID,
};
