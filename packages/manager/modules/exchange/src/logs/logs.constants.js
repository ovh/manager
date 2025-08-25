export const EXCHANGE_LOG_KINDS_KEYS = ['message'];

export const GUIDE = {
  DEFAULT:
    'https://www.ovhcloud.com/en-ie/identity-security-operations/logs-data-platform/',
  DE:
    'https://www.ovhcloud.com/de/identity-security-operations/logs-data-platform/',
  ES:
    'https://www.ovhcloud.com/es-es/identity-security-operations/logs-data-platform/',
  FR:
    'https://www.ovhcloud.com/fr/identity-security-operations/logs-data-platform/',
  IE:
    'https://www.ovhcloud.com/en-ie/identity-security-operations/logs-data-platform/',
  IT:
    'https://www.ovhcloud.com/it/identity-security-operations/logs-data-platform/',
  NL:
    'https://www.ovhcloud.com/nl/identity-security-operations/logs-data-platform/',
  PL:
    'https://www.ovhcloud.com/pl/identity-security-operations/logs-data-platform/',
  PT:
    'https://www.ovhcloud.com/pt/identity-security-operations/logs-data-platform/',
  GB:
    'https://www.ovhcloud.com/en-gb/identity-security-operations/logs-data-platform/',
  CA:
    'https://www.ovhcloud.com/en-ca/identity-security-operations/logs-data-platform/',
  QC:
    'https://www.ovhcloud.com/fr-ca/identity-security-operations/logs-data-platform/',
  WS:
    'https://www.ovhcloud.com/es/identity-security-operations/logs-data-platform/',
  MA:
    'https://www.ovhcloud.com/fr-ma/identity-security-operations/logs-data-platform/',
  SN:
    'https://www.ovhcloud.com/fr-sn/identity-security-operations/logs-data-platform/',
  TN:
    'https://www.ovhcloud.com/fr-tn/identity-security-operations/logs-data-platform/',
  AU:
    'https://www.ovhcloud.com/en-au/identity-security-operations/logs-data-platform/',
  SG:
    'https://www.ovhcloud.com/en-sg/identity-security-operations/logs-data-platform/',
  ASIA:
    'https://www.ovhcloud.com/asia/identity-security-operations/logs-data-platform/',
  IN:
    'https://www.ovhcloud.com/en-in/identity-security-operations/logs-data-platform/',
  WE:
    'https://www.ovhcloud.com/en-ie/identity-security-operations/logs-data-platform/',
  US:
    'https://us.ovhcloud.com/identity-security-operations/logs-data-platform/',
  WW:
    'https://www.ovhcloud.com/en/identity-security-operations/logs-data-platform/',
};

const logsPrefix = 'Network::exchange::logs';

export const EXCHANGE_LOGS_TRACKING_HITS = {
  LOGS_PAGE: logsPrefix,
  TRANSFER: `${logsPrefix}::subscribe`,
  STOP_TRANSFER: `${logsPrefix}::unsubscribe`,
  CREATE_ACCOUNT: `${logsPrefix}::create-account`,
  CREATE_DATA_STREAM: `${logsPrefix}::create-data-stream`,
  SUBSCRIBE_OTHER_ACCOUNT: `${logsPrefix}::subscribe-other-datastream`,
  GRAYLOG_WATCH: `${logsPrefix}::graylog`,
};

export const EXCHANGE_DATA_STREAMS_TRACKING_HITS = {
  LISTING_PAGE: `${logsPrefix}::data-streams`,
  ADD_DATA_STREAM: `${logsPrefix}::data-streams::add-datastream`,
  GO_BACK: `${logsPrefix}::data-streams::back-previous-page`,
  LDP_DETAIL: `${logsPrefix}::data-streams::ldp-detail`,
  SUBSCRIBE: `${logsPrefix}::data-streams::subscribe`,
  UNSUBSCRIBE: `${logsPrefix}::data-streams::unsubscribe`,
};
