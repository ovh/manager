export const SIDEBAR_CONFIG = {
  DOMAINS: {
    title: 'sidebar_section_domains',
    category: 'domain',
    icon: 'ovh-font ovh-font-domain',
    loadOnState: 'app.domain',
    allowSearch: true,
  },
  HOSTING: {
    title: 'sidebar_section_hosting',
    category: 'hosting',
    icon: 'ovh-font ovh-font-hosting',
    loadOnState: 'app.hosting',
    allowSearch: true,
  },
  PRIVATE_DATABASE: {
    title: 'sidebar_section_database',
    category: 'database',
    icon: 'ovh-font ovh-font-database',
    loadOnState: 'app.private-database',
    allowSearch: true,
  },
  EMAIL_PRO: {
    title: 'sidebar_section_emailPro',
    category: 'email',
    icon: 'ovh-font ovh-font-mail',
    loadOnState: 'app.email-pro',
    allowSearch: true,
  },
  EMAIL_DOMAIN: {
    title: 'sidebar_section_email',
    category: 'email',
    icon: 'ovh-font ovh-font-mail',
    loadOnState: 'app.email',
    allowSearch: true,
  },
  MICROSOFT: {
    title: 'sidebar_section_microsoft',
    category: 'microsoft',
    icon: 'ms-Icon ms-Icon--WindowsLogo',
    loadOnState: 'app.microsoft',
    allowSearch: true,
  },
  EMAIL_EXCHANGE: {
    title: 'sidebar_section_exchange',
    category: 'microsoft',
    icon: 'ms-Icon ms-Icon--ExchangeLogo',
    loadOnState: 'app.microsoft.exchange',
  },
  LICENSE_OFFICE: {
    title: 'sidebar_section_office',
    category: 'microsoft',
    icon: 'ms-Icon ms-Icon--OfficeLogo',
    loadOnState: 'app.microsoft.office',
  },
  SHAREPOINT: {
    title: 'sidebar_section_sharepoint',
    category: 'microsoft',
    icon: 'ms-Icon ms-Icon--SharepointLogo',
    loadOnState: 'app.microsoft.sharepoint',
  },
  DEDICATED_SERVERS: {
    title: 'sidebar_section_dedicatedServers',
    name: 'dedicatedServers',
    allowSearch: true,
    loadOnState: 'app.dedicated',
    icon: 'ovh-font ovh-font-server',
  },
  DEDICATED_CLOUD: {
    title: 'sidebar_section_dedicatedClouds',
    name: 'dedicatedClouds',
    allowSearch: true,
    loadOnState: 'app.dedicatedClouds',
    icon: 'ovh-font ovh-font-dedicatedCloud',
  },
  NETWORKS: {
    title: 'sidebar_section_nas_and_cdn',
    name: 'networks',
    allowSearch: true,
    loadOnState: 'app.networks',
    icon: 'ovh-font ovh-font-network',
  },
  LICENCES: {
    title: 'sidebar_section_licences',
    name: 'licences',
    loadOnState: 'app.license',
    state: 'app.license.dashboard',
    icon: 'ovh-font ovh-font-certificate',
  },
  IP: {
    title: 'sidebar_section_ip',
    name: 'ip',
    state: 'app.ip',
    icon: 'ovh-font ovh-font-ip',
  },
  IAAS: {
    title: 'sidebar_section_iaas',
    icon: 'ovh-font ovh-font-cloud-root',
    loadOnState: 'iaas',
  },
  PAAS: {
    title: 'sidebar_section_paas',
    icon: 'ovh-font ovh-font-cloud-package',
    loadOnState: 'paas',
  },
  METRICS: {
    title: 'sidebar_section_metrics',
    icon: 'ovh-font ovh-font-graph',
    loadOnState: 'dbaas.metrics',
  },
  DBAAS_LOGS: {
    title: 'sidebar_section_logs',
    icon: 'fa fa-bar-chart', // "ovh-font ovh-font-logs",
    loadOnState: 'dbaas.logs',
  },
  LOAD_BALANCER: {
    title: 'sidebar_section_load_balancer',
    icon: 'ovh-font ovh-font-iplb',
    loadOnState: 'network.iplb',
  },
  VRACK: {
    title: 'sidebar_section_vrack',
    icon: 'ovh-font ovh-font-vRack',
    loadOnState: 'vrack',
  },
  CLOUD_DESKTOP: {
    title: 'sidebar_section_cloud_desktop',
    icon: 'ovh-font ovh-font-cloud-desktop',
    loadOnState: 'deskaas',
    allowSubItems: true,
  },
  PACK_XDSL: {
    title: 'sidebar_section_pack',
    error: 'sidebar_load_error',
    category: 'xdsl',
    icon: 'ovh-font ovh-font-telecom-ethernet',
    loadOnState: 'telecom.pack',
    allowSearch: true,
    infiniteScroll: true,
  },
  TELEPHONY: {
    title: 'sidebar_section_telephony',
    error: 'sidebar_load_error',
    category: 'telephony',
    icon: 'ovh-font ovh-font-phone',
    loadOnState: 'telecom.telephony',
    allowSearch: true,
    infiniteScroll: true,
  },
  SMS: {
    title: 'sidebar_section_sms',
    error: 'sidebar_load_error',
    category: 'sms',
    icon: 'ovh-font ovh-font-message',
    loadOnState: 'telecom.sms',
  },
  FAX: {
    title: 'sidebar_section_fax',
    error: 'sidebar_load_error',
    category: 'freefax',
    icon: 'ovh-font ovh-font-print',
    loadOnState: 'telecom.freefax',
  },
  OVER_THE_BOX: {
    title: 'sidebar_section_otb',
    error: 'sidebar_load_error',
    category: 'overTheBox',
    icon: 'ovh-font ovh-font-overTheBox',
    loadOnState: 'telecom.overTheBox',
  },
  // temp for detecting missing sidebar config
  default: {
    state: 'welcome',
    prefix: 'missing - ',
  },
};

export const STATE_MAPPING_SERVICE = {
  '/sms/{serviceName}': {
    state: 'sms.dashboard',
    stateParams: {
      serviceName: 'resource.name',
    },
  },
  default: {
    state: 'welcome',
    stateParams: {},
  },
};

export default {
  SIDEBAR_CONFIG, STATE_MAPPING_SERVICE,
};
