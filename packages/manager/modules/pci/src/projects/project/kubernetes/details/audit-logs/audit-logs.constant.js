import { TRACKING_PREFIX, TRACKING_SUFFIX } from '../constants';

export const LOGS_INFO = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-kubernetes-forwarding-audit-logs?id=kb_article_view&sysparm_article=KB0062280',
};

export const KUBERNETES_LOG_KINDS_KEYS = {
  audit: [
    'audit_verb',
    'audit_authorizationDecision',
    'audit_responseStatus',
    'audit_user',
    'audit_requestURI',
    'audit_groups',
    'audit_authorizationReason',
    'audit_userAgent',
    'audit_auditID',
  ],
};

const TILE_TRACKING_PREFIX = `${TRACKING_PREFIX}::page::button`;

export const LOG_TRACKING_HITS = {
  TRANSFER: `${TILE_TRACKING_PREFIX}::transfer${TRACKING_SUFFIX}`,
  CREATE_ACCOUNT: `${TILE_TRACKING_PREFIX}::add_account${TRACKING_SUFFIX}`,
  CREATE_DATA_STREAM: `${TILE_TRACKING_PREFIX}::add_data_flow${TRACKING_SUFFIX}`,
  SUBSCRIBE_OTHER_ACCOUNT: `${TILE_TRACKING_PREFIX}::subscribe_other_account${TRACKING_SUFFIX}`,
  GRAYLOG_WATCH: `${TILE_TRACKING_PREFIX}::graylog_observe${TRACKING_SUFFIX}`,
  STOP_TRANSFER: `${TILE_TRACKING_PREFIX}::stop_transfert${TRACKING_SUFFIX}`,
};

export const LOG_LIST_TRACKING_HITS = {
  LISTING_PAGE: `projects::managed_kubernetes_cluster::managed_kubernetes_cluster::listing::audit_logs::logs_subscriptions::kubernetes`,
  ADD_DATA_STREAM: `${TRACKING_PREFIX}::page::button::add_data_flow${TRACKING_SUFFIX}`,
  GO_BACK: `${TRACKING_PREFIX}::page::link::go_back${TRACKING_SUFFIX}`,
  LDP_DETAIL: `${TRACKING_PREFIX}::datagrid::button::go-to-detail${TRACKING_SUFFIX}`,
  SUBSCRIBE: `${TRACKING_PREFIX}::datagrid::button::subscribe${TRACKING_SUFFIX}`,
  UNSUBSCRIBE: `${TRACKING_PREFIX}::datagrid::button::unsubscribe${TRACKING_SUFFIX}`,
};

export default {
  LOGS_INFO,
  LOG_TRACKING_HITS,
  LOG_LIST_TRACKING_HITS,
};
