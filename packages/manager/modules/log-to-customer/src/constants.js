export const DATA_PLATFORM_GUIDE = {
  DEFAULT: 'https://www.ovhcloud.com/en-gb/logs-data-platform',
  DE: 'https://www.ovhcloud.com/de/logs-data-platform',
  ES: 'https://www.ovhcloud.com/es-es/logs-data-platform',
  FR: 'https://www.ovhcloud.com/fr/logs-data-platform',
  IE: 'https://www.ovhcloud.com/en-ie/logs-data-platform',
  NL: 'https://www.ovhcloud.com/nl/logs-data-platform',
  PL: 'https://www.ovhcloud.com/pl/logs-data-platform',
  PT: 'https://www.ovhcloud.com/pt/logs-data-platform',
  EN: 'https://www.ovhcloud.com/en-gb/logs-data-platform',
  CA: 'https://www.ovhcloud.com/en-ca/logs-data-platform',
  QC: 'https://www.ovhcloud.com/fr-ca/logs-data-platform',
  WS: 'https://www.ovhcloud.com/es/logs-data-platform',
  MA: 'https://www.ovhcloud.com/fr-ma/logs-data-platform',
  SN: 'https://www.ovhcloud.com/fr-sn/logs-data-platform',
  TN: 'https://www.ovhcloud.com/fr-tn/logs-data-platform',
  AU: 'https://www.ovhcloud.com/en-au/logs-data-platform',
  SG: 'https://www.ovhcloud.com/en-sg/logs-data-platform',
  ASIA: 'https://www.ovhcloud.com/asia/logs-data-platform',
  IN: 'https://www.ovhcloud.com/en-in/logs-data-platform',
  WW: 'https://www.ovhcloud.com/en/logs-data-platform',
};

export const LOG_KEYS = {
  _id: 'message._id',
  requestReceivedTimestamp: 'message.audit_requestReceivedTimestamp_date',
  verb: 'message.audit_verb',
  authorizationDecision: 'message.audit_authorizationDecision',
  responseStatus: 'message.audit_responseStatus',
  user: 'message.audit_user',
  requestURI: 'message.audit_requestURI',
  groups: 'message.audit_groups',
  authorizationReason:
    'message.message.annotations.authorization.k8s.io/reason',
  userAgent: 'message.audit_userAgent',
  auditID: 'message.audit_auditID',
};

export default {
  LOG_KEYS,
  DATA_PLATFORM_GUIDE,
};
