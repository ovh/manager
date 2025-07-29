export const CLOUD_CONNECT_LOG_KEYS = ['message'];

export const LOGS_TRACKING_CONTEXT = {
  page_theme: 'Network',
  level2: 99,
};

const logsPrefix = 'network::cloud-connect::::logs';
export const CLOUD_CONNECT_LOGS_TRACKING_HITS = {
  LOGS_PAGE: logsPrefix,
  TRANSFER: `${logsPrefix}::subscribe`,
  STOP_TRANSFER: `${logsPrefix}::unsubscribe`,
  CREATE_ACCOUNT: `${logsPrefix}::create-account`,
  CREATE_DATA_STREAM: `${logsPrefix}::create-data-stream`,
  SUBSCRIBE_OTHER_ACCOUNT: `${logsPrefix}::subscribe-other-datastream`,
  GRAYLOG_WATCH: `${logsPrefix}::graylog`,
};

const dataStreamsPrefix = `${logsPrefix}::data-streams`;
export const CLOUD_CONNECT_DATA_STREAMS_TRACKING_HITS = {
  LISTING_PAGE: dataStreamsPrefix,
  ADD_DATA_STREAM: `${dataStreamsPrefix}::add-datastream`,
  GO_BACK: `${dataStreamsPrefix}::back-previous-page`,
  LDP_DETAIL: `${dataStreamsPrefix}::ldp-detail`,
  SUBSCRIBE: `${dataStreamsPrefix}::subscribe`,
  UNSUBSCRIBE: `${dataStreamsPrefix}::unsubscribe`,
};
