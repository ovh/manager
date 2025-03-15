export const IAM_LOG_KINDS_KEYS = {
  default: ['message'],
};

export const IAM_LOGS_AUDIT_TRACKING_PREFIX =
  'identity-security-operation::identity::logs::';

export const IAM_LOGS_TRACKING_HITS = {
  AUDIT: {
    LOGS_PAGE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}log-audits`,
    TRANSFER: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::subscribe_log-audit`,
    CREATE_ACCOUNT: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::create-account_log-audit`,
    CREATE_DATA_STREAM: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::create-data-stream_log-audit`,
    SUBSCRIBE_OTHER_ACCOUNT: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::create-data-stream_log-audit`,
    GRAYLOG_WATCH: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}graylog_log-audit`,
    STOP_TRANSFER: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::unsubscribe_log-audit`,
  },
};

const featureLogs = 'identity-access-management:logs';
export const FEATURE_LOGS = {
  ROOT: featureLogs,
  AUDIT: `${featureLogs}:audit`,
  ACTIVITY: `${featureLogs}:activity`,
  ACCESS_POLICY: `${featureLogs}:access-policy`,
};
