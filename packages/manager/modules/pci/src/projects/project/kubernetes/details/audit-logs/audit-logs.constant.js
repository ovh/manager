export const LOGS_INFO = {
  FR: 'https://docs.ovh.com/fr/logs-data-platform/kubernetes-fluent-bit/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/logs-data-platform/kubernetes-fluent-bit/',
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
  LOGS_INFO,
  LOG_KEYS,
};
