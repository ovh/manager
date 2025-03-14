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
  ACCESS_POLICY: {
    LOGS_PAGE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}log-access-policy`,
    TRANSFER: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::subscribe_log-access-policy`,
    CREATE_ACCOUNT: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::create-account_log-access-policy`,
    CREATE_DATA_STREAM: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::create-data-stream_log-access-policy`,
    SUBSCRIBE_OTHER_ACCOUNT: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::create-data-stream_log-access-policy`,
    GRAYLOG_WATCH: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}graylog_log-access-policy`,
    STOP_TRANSFER: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::unsubscribe_log-access-policy`,
  },
};

export const IAM_DATA_STREAMS_TRACKING_HITS = {
  LISTING_PAGE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}logs_subscriptions`,
  ADD_DATA_STREAM: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::button::add_datastream_logs_datastream`,
  GO_BACK: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}page::link::go_back_logs_datastream`,
  LDP_DETAIL: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}datagrid::button::go-to-detail_logs_datastream`,
  SUBSCRIBE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}datagrid::button::subscribe_logs_datastream`,
  UNSUBSCRIBE: `${IAM_LOGS_AUDIT_TRACKING_PREFIX}datagrid::button::unsubscribe_logs_datastream`,
};

const featureLogs = 'identity-access-management:logs';
export const FEATURE_LOGS = {
  ROOT: featureLogs,
  AUDIT: `${featureLogs}:audit`,
  ACTIVITY: `${featureLogs}:activity`,
  ACCESS_POLICY: `${featureLogs}:access-policy`,
};
