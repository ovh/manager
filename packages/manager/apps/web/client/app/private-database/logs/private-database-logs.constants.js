export const PRIVATE_DATABASE_LOGS_SERVICE_GUIDE_LINK = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062040',
  FR:
    'https://help.ovhcloud.com/csm/fr-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062007',
  DE:
    'https://help.ovhcloud.com/csm/de-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062033',
  ES:
    'https://help.ovhcloud.com/csm/es-es-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062037',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062032',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062032',
  IT:
    'https://help.ovhcloud.com/csm/it-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062041',
  PL:
    'https://help.ovhcloud.com/csm/pl-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062043',
  PT:
    'https://help.ovhcloud.com/csm/pt-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062035',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062031',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062034',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062008',
  WS:
    'https://help.ovhcloud.com/csm/es-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062042',
  AU:
    'https://help.ovhcloud.com/csm/en-au-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062036',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062039',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-web-cloud-db-retrieve-logs?id=kb_article_view&sysparm_article=KB0062038',
};

export const PRIVATE_DATABASE_LOGS_KINDS_KEYS = {
  dbms: ['message'],
};

export const PRIVATE_DATABASE_LOGS_TRACKING_HITS = {
  LOGS_PAGE: 'web::private-database::dashboard::logs',
  TRANSFER: 'web::private-database::dashboard::logs::subscribe',
  STOP_TRANSFER: 'web::private-database::dashboard::logs::unsubscribe',
  SUBSCRIBE_OTHER_ACCOUNT:
    'web::private-database::dashboard::logs::subscribe-other-datastream',
  CREATE_ACCOUNT: 'web::private-database::dashboard::logs::create-account',
  CREATE_DATA_STREAM:
    'web::private-database::dashboard::logs::create-data-stream',
  GRAYLOG_WATCH: 'web::private-database::dashboard::logs::graylog',
};
