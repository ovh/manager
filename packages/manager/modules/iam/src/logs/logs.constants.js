export const IAM_LOG_KINDS_KEYS = {
  default: [
    'client_ip',
    'http_verb',
    'http_request',
    'http_version_num',
    'http_status_int',
    'bytes_uploaded_int',
  ],
};

// TODO waiting for tracking PR
export const IAM_LOGS_TRACKING_HITS = {
  LOGS_PAGE: ``,
  TRANSFER: ``,
  CREATE_ACCOUNT: ``,
  CREATE_DATA_STREAM: ``,
  SUBSCRIBE_OTHER_ACCOUNT: ``,
  GRAYLOG_WATCH: ``,
  STOP_TRANSFER: ``,
};

const featureLogs = 'identity-access-management:logs';
export const FEATURE_LOGS = {
  ROOT: featureLogs,
  AUDIT: `${featureLogs}:audit`,
  ACTIVITY: `${featureLogs}:activity`,
  ACCESS_POLICY: `${featureLogs}:access-policy`,
};
