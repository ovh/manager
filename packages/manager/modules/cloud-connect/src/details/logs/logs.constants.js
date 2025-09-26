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

export const CLOUD_CONNECT_LOGS_GUIDE = {
  DE:
    'https://help.ovhcloud.com/csm/de-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072328',
  ES:
    'https://help.ovhcloud.com/csm/es-es-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072340',
  FR:
    'https://help.ovhcloud.com/csm/fr-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072334',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072331',
  IT:
    'https://help.ovhcloud.com/csm/it-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072336',
  PL:
    'https://help.ovhcloud.com/csm/pl-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072330',
  PT:
    'https://help.ovhcloud.com/csm/pt-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072337',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072332',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072329',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072341',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/44400649100307-OVHcloud-Connect-Logs-forwarding',
  WS:
    'https://help.ovhcloud.com/csm/es-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072342',
  AU:
    'https://help.ovhcloud.com/csm/en-au-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072333',
  IN:
    'https://help.ovhcloud.com/csm/en-in-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072339',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072335',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-network-ovhcloud-connect-logs-to-customers?id=kb_article_view&sysparm_article=KB0072327',
};

CLOUD_CONNECT_LOGS_GUIDE.NL = CLOUD_CONNECT_LOGS_GUIDE.IE;
CLOUD_CONNECT_LOGS_GUIDE.WE = CLOUD_CONNECT_LOGS_GUIDE.IE;
CLOUD_CONNECT_LOGS_GUIDE.WW = CLOUD_CONNECT_LOGS_GUIDE.IE;
CLOUD_CONNECT_LOGS_GUIDE.MA = CLOUD_CONNECT_LOGS_GUIDE.FR;
CLOUD_CONNECT_LOGS_GUIDE.SN = CLOUD_CONNECT_LOGS_GUIDE.FR;
CLOUD_CONNECT_LOGS_GUIDE.TN = CLOUD_CONNECT_LOGS_GUIDE.FR;
