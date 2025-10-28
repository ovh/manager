import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export const TRACKING_PREFIX = 'PublicCloud::projects::managed_kubernetes_cluster';
export const TRACKING_SUFFIX = '_managed_kubernetes_cluster::kubernetes';

type OvhSubsidiaryRecord = Partial<Record<OvhSubsidiary, string>>;

export const LOGS_INFO: OvhSubsidiaryRecord = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-kubernetes-forwarding-audit-logs?id=kb_article_view&sysparm_article=KB0062280',
  US: 'https://support.us.ovhcloud.com/hc/en-us/articles/29326025853715-Managed-Kubernetes-Service-Audit-Logs-Forwarding',
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

export const DATA_PLATFORM_GUIDE: OvhSubsidiaryRecord = {
  DEFAULT: 'https://www.ovhcloud.com/en-gb/logs-data-platform',
  DE: 'https://www.ovhcloud.com/de/logs-data-platform',
  ES: 'https://www.ovhcloud.com/es-es/logs-data-platform',
  FR: 'https://www.ovhcloud.com/fr/logs-data-platform',
  IE: 'https://www.ovhcloud.com/en-ie/logs-data-platform',
  NL: 'https://www.ovhcloud.com/nl/logs-data-platform',
  PL: 'https://www.ovhcloud.com/pl/logs-data-platform',
  PT: 'https://www.ovhcloud.com/pt/logs-data-platform',
  GB: 'https://www.ovhcloud.com/en-gb/logs-data-platform',
  CA: 'https://www.ovhcloud.com/en-ca/logs-data-platform',
  QC: 'https://www.ovhcloud.com/fr-ca/logs-data-platform',
  WS: 'https://www.ovhcloud.com/es/logs-data-platform',
  MA: 'https://www.ovhcloud.com/fr-ma/logs-data-platform',
  SN: 'https://www.ovhcloud.com/fr-sn/logs-data-platform',
  TN: 'https://www.ovhcloud.com/fr-tn/logs-data-platform',
  AU: 'https://www.ovhcloud.com/en-au/logs-data-platform',
  SG: 'https://www.ovhcloud.com/en-sg/logs-data-platform',
  ASIA: 'https://www.ovhcloud.com/asia/logs-data-platform',
  IN: 'https://www.ovhcloud.com/en-in/logs-data-platform',
  US: 'https://us.ovhcloud.com/identity-security-operations/logs-data-platform/',
};
