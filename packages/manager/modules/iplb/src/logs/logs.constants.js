export const IPLB_LOG_KINDS_KEYS = {
  http: ['message'],
  tcp: ['message'],
};

// TODO update guides
export const GUIDE = {
  FR: 'https://www.ovh.com/fr/support/',
  GB: 'https://www.ovh.com/fr/support/',
};

const logsPrefix = 'dedicated::iplb::dashboard::logs';

export const IPLB_LOGS_TRACKING_HITS = {
  LOGS_PAGE: logsPrefix,
  TRANSFER: `${logsPrefix}::subscribe`,
  STOP_TRANSFER: `${logsPrefix}::unsubscribe`,
  CREATE_ACCOUNT: `${logsPrefix}::create-account`,
  CREATE_DATA_STREAM: `${logsPrefix}::create-data-stream`,
  SUBSCRIBE_OTHER_ACCOUNT: `${logsPrefix}::subscribe-other-datastream`,
  GRAYLOG_WATCH: `${logsPrefix}::graylog`,
};

export const IPLB_DATA_STREAMS_TRACKING_HITS = {
  LISTING_PAGE: `${logsPrefix}::data-streams`,
  ADD_DATA_STREAM: `${logsPrefix}::data-streams::add-datastream`,
  GO_BACK: `${logsPrefix}::data-streams::back-previous-page`,
  LDP_DETAIL: `${logsPrefix}::data-streams::ldp-detail`,
  SUBSCRIBE: `${logsPrefix}::data-streams::subscribe`,
  UNSUBSCRIBE: `${logsPrefix}::data-streams::unsubscribe`,
};
