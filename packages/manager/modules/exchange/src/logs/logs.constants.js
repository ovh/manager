export const EXCHANGE_LOG_KINDS_KEYS = ['message'];

export const GUIDE = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  DE:
    'https://help.ovhcloud.com/csm/de-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073324',
  ES:
    'https://help.ovhcloud.com/csm/es-es-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073329',
  FR:
    'https://help.ovhcloud.com/csm/fr-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073325',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  IT:
    'https://help.ovhcloud.com/csm/it-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073323',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  PL:
    'https://help.ovhcloud.com/csm/pl-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073326',
  PT:
    'https://help.ovhcloud.com/csm/pt-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073330',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073321',
  CA:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  QC:
    'https://help.ovhcloud.com/csm/fr-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073325',
  WS:
    'https://help.ovhcloud.com/csm/es-es-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073329',
  MA:
    'https://help.ovhcloud.com/csm/fr-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073325',
  SN:
    'https://help.ovhcloud.com/csm/fr-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073325',
  TN:
    'https://help.ovhcloud.com/csm/fr-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073325',
  AU:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  SG:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  ASIA:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  IN:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-exchange-logs-management?id=kb_article_view&sysparm_article=KB0073322',
};

const logsPrefix = 'Web::microsoft::exchange::logs';

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
