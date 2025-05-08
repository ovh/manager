export const IAM_LOG_KINDS_KEYS = {
  default: ['message'],
};

export const IAM_LOGS_AUDIT_TRACKING_PREFIX =
  'identity-security-operation::identity::logs::';

const logsAuditPrefix = `${IAM_LOGS_AUDIT_TRACKING_PREFIX}log-audits`;
const logsAccessPolicyPrefix = `${IAM_LOGS_AUDIT_TRACKING_PREFIX}log-access`;
const logsActivityPrefix = `${IAM_LOGS_AUDIT_TRACKING_PREFIX}log-activity`;

export const IAM_LOGS_TRACKING_HITS = {
  AUDIT: {
    LOGS_PAGE: logsAuditPrefix,
    TRANSFER: `${logsAuditPrefix}::subscribe`,
    STOP_TRANSFER: `${logsAuditPrefix}::unsubscribe`,
    CREATE_ACCOUNT: `${logsAuditPrefix}::create-account`,
    CREATE_DATA_STREAM: `${logsAuditPrefix}::create-data-stream`,
    SUBSCRIBE_OTHER_ACCOUNT: `${logsAuditPrefix}::subscribe-other-datastream`,
    GRAYLOG_WATCH: `${logsAuditPrefix}::graylog`,
  },
  ACCESS_POLICY: {
    LOGS_PAGE: logsAccessPolicyPrefix,
    TRANSFER: `${logsAccessPolicyPrefix}::subscribe`,
    STOP_TRANSFER: `${logsAccessPolicyPrefix}::unsubscribe`,
    CREATE_ACCOUNT: `${logsAccessPolicyPrefix}::create-account`,
    CREATE_DATA_STREAM: `${logsAccessPolicyPrefix}::create-data-stream`,
    SUBSCRIBE_OTHER_ACCOUNT: `${logsAccessPolicyPrefix}::subscribe-other-datastream`,
    GRAYLOG_WATCH: `${logsAccessPolicyPrefix}::graylog`,
  },
  ACTIVITY: {
    LOGS_PAGE: logsActivityPrefix,
    TRANSFER: `${logsActivityPrefix}::subscribe`,
    STOP_TRANSFER: `${logsActivityPrefix}::unsubscribe`,
    CREATE_ACCOUNT: `${logsActivityPrefix}::create-account`,
    CREATE_DATA_STREAM: `${logsActivityPrefix}::create-data-stream`,
    SUBSCRIBE_OTHER_ACCOUNT: `${logsActivityPrefix}::subscribe-other-datastream`,
    GRAYLOG_WATCH: `${logsActivityPrefix}::graylog`,
  },
};

export const IAM_DATA_STREAMS_TRACKING_HITS = {
  AUDIT: {
    LISTING_PAGE: `${logsAuditPrefix}::data-streams`,
    ADD_DATA_STREAM: `${logsAuditPrefix}::data-streams::add-datastream`,
    GO_BACK: `${logsAuditPrefix}::data-streams::back-previous-page`,
    LDP_DETAIL: `${logsAuditPrefix}::data-streams::ldp-detail`,
    SUBSCRIBE: `${logsAuditPrefix}::data-streams::subscribe`,
    UNSUBSCRIBE: `${logsAuditPrefix}::data-streams::unsubscribe`,
  },
  ACCESS_POLICY: {
    LISTING_PAGE: `${logsAccessPolicyPrefix}::data-streams`,
    ADD_DATA_STREAM: `${logsAccessPolicyPrefix}::data-streams::add-datastream`,
    GO_BACK: `${logsAccessPolicyPrefix}::data-streams::back-previous-page`,
    LDP_DETAIL: `${logsAccessPolicyPrefix}::data-streams::ldp-detail`,
    SUBSCRIBE: `${logsAccessPolicyPrefix}::data-streams::subscribe`,
    UNSUBSCRIBE: `${logsAccessPolicyPrefix}::data-streams::unsubscribe`,
  },
  ACTIVITY: {
    LISTING_PAGE: `${logsActivityPrefix}::data-streams`,
    ADD_DATA_STREAM: `${logsActivityPrefix}::data-streams::add-datastream`,
    GO_BACK: `${logsActivityPrefix}::data-streams::back-previous-page`,
    LDP_DETAIL: `${logsActivityPrefix}::data-streams::ldp-detail`,
    SUBSCRIBE: `${logsActivityPrefix}::data-streams::subscribe`,
    UNSUBSCRIBE: `${logsActivityPrefix}::data-streams::unsubscribe`,
  },
};

const featureLogs = 'identity-access-management:logs';
export const FEATURE_LOGS = {
  ROOT: featureLogs,
  AUDIT: `${featureLogs}:audit`,
  ACTIVITY: `${featureLogs}:activity`,
  ACCESS_POLICY: `${featureLogs}:access-policy`,
};
