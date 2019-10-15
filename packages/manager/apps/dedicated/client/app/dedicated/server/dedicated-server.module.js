angular
  .module('App')
  .constant('WEATHERMAP_URL', 'http://weathermap.ovh.net/')
  .constant('VMS_URL', 'http://weathermap.ovh.net/')
  .constant('NO_AUTORENEW_COUNTRIES', [
    'ASIA',
    'AU',
    'CZ',
    'PL',
    'CA',
    'QC',
    'SG',
    'WE',
    'WS',
    'MA',
    'TN',
    'SN',
  ])
  .constant('FIREWALL_RULE_ACTIONS', {
    ALLOW: 'PERMIT',
    DENY: 'DENY',
  })
  .constant('FIREWALL_RULE_PROTOCOLS', {
    IPV_4: 'IPv4',
    UDP: 'UDP',
    TCP: 'TCP',
    ICMP: 'ICMP',
  })
  .constant('FIREWALL_STATUSES', {
    ACTIVATED: 'ACTIVATED',
    DEACTIVATED: 'DEACTIVATED',
    NOT_CONFIGURED: 'NOT_CONFIGURED',
  })
  .constant('MITIGATION_STATUSES', {
    ACTIVATED: 'ACTIVATED',
    AUTO: 'AUTO',
    FORCED: 'FORCED',
  })
  .constant('STATISTICS_SCALE', {
    TENSECS: '_10_S',
    ONEMIN: '_1_M',
    FIVEMINS: '_5_M',
  })
  .constant('NEW_RANGE', {
    PATTERN: /^(ADV|STOR|ADVANCE|RISE|INFRA)-[1-9]$/,
  });
