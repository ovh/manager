export const ALIGNMENT_URLS = {
  ASIA: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  AU: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  CA: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  CZ: 'https://www.ovh.cz/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  DE: 'https://www.ovh.de/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  ES: 'https://www.ovh.es/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  FI: 'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  FR: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?alignDate=1',
  GB: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  IE: 'https://www.ovh.ie/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  IT: 'https://www.ovh.it/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  LT: 'https://www.ovh.lt/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  NL: 'https://www.ovh.nl/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  PL: 'https://www.ovh.pl/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  PT: 'https://www.ovh.pt/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  QC: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?alignDate=1',
  SG: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  US: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  WE: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  WS: 'https://www.ovh.es/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  IN: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
};

export const AUTORENEW_EVENT = 'billing.autorenew.changed';

export const COLUMNS_CONFIG = [
  {
    property: 'serviceId',
  },
  {
    property: 'serviceType',
  },
  {
    property: 'status',
  },
  {
    property: 'renewPeriod',
  },
  {
    property: 'expiration',
  },
];

export const CONTRACTS_IDS = {
  CA: 1752,
  QC: 1753,
  WE: 1754,
  WS: 1755,
};

export const MIN_DOMAIN_LENGTH = 50;

export const NIC_ALL = 'billing_autorenew_nic_all';

export const SERVICE_EXPIRATION = {
  EXPIRES_IN_A_WEEK: 'weeks',
  EXPIRES_IN_A_MONTH: 'months',
  RENEWED_IN_AMONTH: 'renew_month',
};

export const SERVICE_STATES = {
  UP: 'UP',
  EXPIRED: 'EXPIRED',
};

export const SERVICE_STATUS = {
  AUTOMATIC: 'auto',
  MANUAL: 'manual',
  PENDING_DEBT: 'pending_debt',
  PENDING_RESILIATION: 'delete_at_expiration',
  RESILIATED: 'expired',
};

export const URL_PARAMETER_SEPARATOR = '%20';

export const SERVICE_RENEW_MODES = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
};

export const SERVICE_TYPES = {
  ZIMBRA_SLOT: 'ZIMBRA_SLOT',
};

// This list represent what service types uses apiv6 `/services` routes to
// handle retrieving informations about the service and updating it
export const SERVICE_TYPES_USING_V6_SERVICES = [SERVICE_TYPES.ZIMBRA_SLOT];

const TRACKING_CHAPTER_1 = 'Hub';
const TRACKING_CHAPTER_2 = 'billing';
const TRACKING_CHAPTER_3 = 'services';

const TRACKING_PAGE_SUFFIX = 'services::listing::autorenew';
export const TRACKING_PAGE_CATEGORY = 'listing';
export const TRACKING_PAGE = `${TRACKING_CHAPTER_1}::${TRACKING_CHAPTER_2}::${TRACKING_CHAPTER_3}::${TRACKING_PAGE_SUFFIX}`;
export const TRACKING_FILTER_NAME_PREFIX =
  'Hub::billing::services::listing::button::filter_services';

export const TRACKING_AUTORENEW_PAGE_NAME = `Hub::billing::services::services::listing::autorenew`;
export const TRACKING_SSH_PAGE_NAME = `${TRACKING_AUTORENEW_PAGE_NAME}::ssh`;
export const TRACKING_AGREEMENTS_PAGE_NAME = `${TRACKING_AUTORENEW_PAGE_NAME}::agreements`;

export const TRACKING_ACTIONS_PREFIX = `${TRACKING_CHAPTER_1}::${TRACKING_CHAPTER_2}::${TRACKING_CHAPTER_3}::${TRACKING_PAGE_CATEGORY}`;

export const SERVICE_NAME_PLACEHOLDER = '{serviceName}';
export const SERVICE_INFOS_URLS_BY_TYPE = {
  ALL_DOM: `/allDom/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  CLUSTER_HADOOP: `/cluster/hadoop/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  CDN_DEDICATED: `/cdn/dedicated/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  CDN_WEBSITE: `/cdn/website/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  CDN_WEBSTORAGE: `/cdn/webstorage/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DEDICATED_ANTHOS: `/dedicated/anthos/tenants/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DEDICATED_NAS: `/dedicated/nas/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DEDICATED_NASHA: `/dedicated/nasha/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DEDICATED_SERVER: `/dedicated/server/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DEDICATED_HOUSING: `/dedicated/housing/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  VPS: `/vps/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DEDICATED_CLOUD: `/dedicatedCloud/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  ESSENTIALS: `/dedicatedCloud/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DOMAIN: `/domain/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  EMAIL_DOMAIN: `/email/domain/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  HOSTING_WEB: `/hosting/web/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  HOSTING_RESELLER: `/hosting/reseller/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  HOSTING_PRIVATE_DATABASE: `/hosting/privateDatabase/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_CLOUD_LINUX: `/license/cloudLinux/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_CPANEL: `/license/cpanel/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_DIRECT_ADMIN: `/license/directadmin/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_PLESK: `/license/plesk/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_VIRTUOZZO: `/license/virtuozzo/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_WINDOWS: `/license/windows/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_WORKLIGHT: `/license/worklight/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_OFFICE: `/license/office/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  LICENCE_SQL_SERVER: `/license/sqlserver/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  MIS: `/stack/mis/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  OVER_THE_BOX: `/overTheBox/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  ROUTER: `/router/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  SMS: `/sms/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  TELEPHONY: `/telephony/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  XDSL: `/xdsl/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  IP_LOADBALANCING: `/ip/loadBalancing/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  CAAS_CONTAINERS: `/caas/containers/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  CAAS_REGISTRY: `/caas/registry/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DBAAS_QUEUE: `/dbaas/queue/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DESKAAS: `/deskaas/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  HORIZONVIEW: `/horizonView/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  PAAS_DATABASE: `/paas/database/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  PAAS_MONITORING: `/paas/monitoring/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DBAAS_TIMESERIES: `/dbaas/timeseries/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DBAAS_LOGS: `/dbaas/logs/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  DEDICATED_CEPH: `/dedicated/ceph/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  SAAS_CSP2: `/saas/csp2/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  SSL_GATEWAY: `/sslGateway/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  EMAIL_PRO: `/email/pro/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  VEEAM_CLOUD_CONNECT: `/veeamCloudConnect/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  VEEAM_ENTERPRISE: `/veeam/veeamEnterprise/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  SHAREPOINT: `/msServices/sharepoint/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  VIP: `/vip/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  EXCHANGE: `/email/exchange/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  METRICS: `/metrics/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  COWORKING: `/coworking/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  IP_LOADBALANCER: `/ipLoadbalancing/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  WEBCOACH: `/webcoach/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  OVH_CLOUD_CONNECT: `/ovhCloudConnect/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  NETAPP: `/storage/netapp/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
  NUTANIX: `/nutanix/${SERVICE_NAME_PLACEHOLDER}/serviceInfos`,
};

export default {
  AUTORENEW_EVENT,
  CONTRACTS_IDS,
  MIN_DOMAIN_LENGTH,
  NIC_ALL,
  SERVICE_EXPIRATION,
  SERVICE_STATES,
  SERVICE_STATUS,
  URL_PARAMETER_SEPARATOR,
  SERVICE_INFOS_URLS_BY_TYPE,
  SERVICE_NAME_PLACEHOLDER,
};
