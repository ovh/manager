export const IPLB_LOG_KINDS_KEYS = {
  http: ['message'],
  tcp: ['message'],
};

export const GUIDE = {
  FR:
    'https://help.ovhcloud.com/csm/fr-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070843',
  MA:
    'https://help.ovhcloud.com/csm/fr-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070843',
  SN:
    'https://help.ovhcloud.com/csm/fr-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070843',
  TN:
    'https://help.ovhcloud.com/csm/fr-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070843',
  DE:
    'https://help.ovhcloud.com/csm/de-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070856',
  ES:
    'https://help.ovhcloud.com/csm/es-es-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070847',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070838',
  IE:
    'https://help.ovhcloud.com/csm/es-es-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070847',
  IT:
    'https://help.ovhcloud.com/csm/it-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070849',
  PL:
    'https://help.ovhcloud.com/csm/pl-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070844',
  PT:
    'https://help.ovhcloud.com/csm/pt-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070846',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070839',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070837',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070841',
  WS:
    'https://help.ovhcloud.com/csm/es-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070845',
  AU:
    'https://help.ovhcloud.com/csm/en-au-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070834',
  IN:
    'https://help.ovhcloud.com/csm/en-in-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070848',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070842',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-load-balancer-api-logs-2-customers?id=kb_article_view&sysparm_article=KB0070835',
};

const logsPrefix = 'Network::iplb::logs';

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
