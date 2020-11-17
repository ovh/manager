import { DEDICATED, CLOUD, HPC_NAMESPACE } from './constants';

export const DEDICATED_SERVER_CONFIG = {
  id: 'dedicatedServers',
  loadOnState: 'app.dedicated',
  children: [
    {
      id: 'servers_all',
      state: 'app.dedicated.servers',
      stateUrl: '#/configuration/servers',
      icon: 'ovh-font ovh-font-server',
      app: [DEDICATED],
    },
  ],
  types: [
    {
      path: '/dedicated/housing',
      category: 'HOUSING',
      state: 'app.dedicated.housing',
      stateParams: ['productId'],
      app: [DEDICATED],
      searchKeys: ['HOUSING'],
    },
    {
      path: '/dedicated/server',
      category: 'SERVER',
      state: 'app.dedicated.server',
      stateParams: ['productId'],
      app: [DEDICATED],
      searchKeys: ['SERVER'],
    },
  ],
  icon: 'ovh-font ovh-font-server',
  app: [DEDICATED],
  regions: ['EU', 'CA', 'US'],
};

export const DEDICATED_CLOUD_CONFIG = {
  id: 'dedicatedClouds',
  types: [
    {
      path: '/dedicatedCloud',
      types: [
        {
          path: '/dedicatedCloud/:productId/datacenter',
          state: 'app.dedicatedClouds.datacenter',
          stateParams: ['productId', 'datacenterId'],
          app: [DEDICATED],
          namespace: HPC_NAMESPACE,
          subType: 'EPCC',
        },
      ],
      state: 'app.dedicatedClouds',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-dedicatedCloud',
      app: [DEDICATED],
      namespace: HPC_NAMESPACE,
      subType: 'EPCC',
    },
  ],
  loadOnState: 'app.dedicatedClouds',
  icon: 'ovh-font ovh-font-dedicatedCloud',
  app: [DEDICATED],
  regions: ['EU', 'CA', 'US'],
  namespace: HPC_NAMESPACE,
};

export const MANAGED_BAREMETAL_CONFIG = {
  id: 'managedBaremetal',
  types: [
    {
      path: '/dedicatedCloud',
      types: [
        {
          path: '/dedicatedCloud/:productId/datacenter',
          state: 'app.managedBaremetal.datacenter',
          stateParams: ['productId', 'datacenterId'],
          app: [DEDICATED],
          subType: 'MBM',
        },
      ],
      state: 'app.managedBaremetal',
      stateParams: ['productId'],
      icon: 'oui-icon oui-icon-cloud-essential_concept',
      app: [DEDICATED],
      subType: 'MBM',
    },
  ],
  loadOnState: 'app.managedBaremetal',
  icon: 'oui-icon oui-icon-cloud-essential_concept',
  app: [DEDICATED],
  regions: ['EU', 'CA', 'US'],
};

export const NETWORKS_CONFIG = {
  id: 'networks',
  types: [
    {
      path: '/cdn/dedicated',
      types: [
        {
          path: '/cdn/dedicated/:productId/domains',
          state: 'app.networks.cdn.dedicated.domain',
          stateParams: ['productId', 'domain'],
          app: [DEDICATED],
          regions: ['EU'],
        },
      ],
      state: 'app.networks.cdn.dedicated',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-cdn',
      app: [DEDICATED],
      regions: ['EU'],
      searchKeys: ['Content Delivery Network'],
    },
    {
      path: '/dedicated/nas',
      state: 'app.networks.nas.details',
      stateParams: ['nasId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [DEDICATED],
      regions: ['EU', 'CA'],
      searchKeys: ['NAS'],
    },
    {
      path: '/dedicated/nasha',
      state: 'nasha.nasha-partitions',
      stateParams: ['nashaId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [DEDICATED],
      regions: ['EU', 'CA'],
      searchKeys: ['NAS', 'NASHA', 'NAS-HA'],
    },
  ],
  loadOnState: ['nasha.nasha-partitions', 'app.networks'],
  icon: 'ovh-font ovh-font-network',
  app: [DEDICATED],
  regions: ['EU', 'CA'],
};

export const ENTERPRISE_CLOUD_DATABASE = {
  app: [DEDICATED],
  icon: 'ovh-font ovh-font-database',
  id: 'enterprise_cloud_database',
  regions: ['EU'],
  state: 'enterprise-cloud-database',
  stateUrl: '#/enterprise-cloud-database',
};

export const MICROSOFT_CONFIG = {
  id: 'microsoft_exchange',
  types: [
    {
      path: '/email/exchange',
      icon: 'ms-Icon ms-Icon--ExchangeLogo',
      loadOnState: 'app.microsoft.exchange',
      stateParams: ['organization'],
      app: [DEDICATED],
      types: [
        {
          path: '/email/exchange',
          icon: 'ms-Icon ms-Icon--ExchangeLogo',
          state: 'app.exchange',
          stateParams: ['organization', 'productId'],
          app: [DEDICATED],
        },
      ],
    },
  ],
  loadOnState: 'app.microsoft.exchange',
  icon: 'ms-Icon ms-Icon--ExchangeLogo',
  app: [DEDICATED],
  regions: ['CA'],
};

export const LICENCE_CONFIG = {
  id: 'licences',
  state: 'app.license.dashboard',
  icon: 'ovh-font ovh-font-certificate',
  stateUrl: '#/configuration/license?landingTo=licences',
  app: [DEDICATED],
  regions: ['EU', 'CA', 'US'],
};

export const IP_CONFIG = {
  id: 'ip',
  state: 'app.ip',
  stateUrl: '#/configuration/ip?landingTo=ip',
  icon: 'ovh-font ovh-font-ip',
  app: [DEDICATED],
  regions: ['EU', 'CA', 'US'],
  namespace: [undefined, HPC_NAMESPACE],
};

export const IAAS_CONFIG = {
  id: 'vps',
  loadOnState: 'vps',
  types: [
    {
      path: '/vps',
      state: 'vps.detail.dashboard',
      stateParams: ['serviceName'],
      loadOnState: 'vps.detail',
      icon: 'ovh-font ovh-font-vps',
      app: [DEDICATED],
      searchKeys: ['VPS'],
    },
  ],
  icon: 'ovh-font ovh-font-cloud-root',
  app: [DEDICATED],
};

export const PAAS_CONFIG = {
  id: 'paas',
  loadOnState: [
    'paas.cda',
    'paas.veeam.detail',
    'veeam-cloud-connect',
    'veeam-enterprise',
  ],
  types: [
    {
      path: '/dedicated/ceph',
      state: 'paas.cda.cda-details.cda-details-home',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-cloud-disk-array',
      app: [CLOUD],
      regions: ['EU', 'CA'],
      searchKeys: ['Cloud Disk Array', 'CDA'],
      namespace: [undefined],
    },
    {
      path: '/veeamCloudConnect',
      state: 'veeam-cloud-connect.detail.dashboard',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-veeam',
      app: [DEDICATED],
      regions: ['EU', 'CA'],
      searchKeys: ['Veeam Cloud Connect', 'VEEAM'],
      namespace: [undefined],
    },
    {
      path: '/veeam/veeamEnterprise',
      state: 'veeam-enterprise.dashboard',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-veeam',
      app: [DEDICATED],
      regions: ['EU'],
      searchKeys: ['Veeam Enterprise', 'VEEAM_ENTERPRISE'],
      namespace: [HPC_NAMESPACE],
    },
  ],
  icon: 'ovh-font ovh-font-cloud-package',
  app: [CLOUD],
  regions: ['EU', 'CA'],
  namespace: [undefined, HPC_NAMESPACE],
};

export const METRICS_CONFIG = {
  id: 'metrics',
  loadOnState: 'dbaas.metrics',
  types: [
    {
      path: '/metrics',
      state: 'dbaas.metrics.detail.dashboard',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-graph',
      app: [CLOUD],
      searchKeys: ['IOT', 'Metrics', 'Monitoring', 'Time Series', 'TimeSeries'],
    },
  ],
  icon: 'ovh-font ovh-font-graph',
  app: [CLOUD],
  regions: ['EU'],
};

export const LOGS_CONFIG = {
  id: 'logs',
  loadOnState: 'dbaas-logs',
  types: [
    {
      path: '/dbaas/logs',
      state: 'dbaas-logs.detail',
      stateParams: ['serviceName'],
      app: [DEDICATED],
    },
  ],
  children: [
    {
      id: 'logs_all_accounts',
      state: 'dbaas-logs',
      stateUrl: '#/dbaas/logs/list',
      app: [DEDICATED],
    },
  ],
  icon: 'fa fa-bar-chart',
  app: [DEDICATED],
  regions: ['EU', 'CA'],
};

export const IPLB_CONFIG = {
  id: 'load_balancer',
  loadOnState: 'network.iplb',
  types: [
    {
      path: '/ipLoadbalancing',
      state: 'network.iplb.detail.home',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-iplb',
      app: [DEDICATED],
      searchKeys: ['IP Load Balancer', 'IPLB'],
    },
  ],
  icon: 'ovh-font ovh-font-iplb',
  app: [DEDICATED],
  regions: ['EU', 'CA'],
};

export const DEDICATED_NETWORK_CONFIG = {
  id: 'dedicated_network',
  forceDisplaySearch: true,
  app: [DEDICATED],
  regions: ['EU', 'CA', 'US'],
  namespace: [undefined, HPC_NAMESPACE],
  icon: 'oui-icon oui-icon-bandwidth_concept',
  loadOnState: ['vrack', 'cloud-connect'],
  children: [
    {
      id: 'vrack',
      loadOnState: 'vrack',
      types: [
        {
          path: '/vrack',
          state: 'vrack',
          stateParams: ['vrackId'],
          app: [DEDICATED],
          namespace: [undefined, HPC_NAMESPACE],
        },
      ],
      icon: 'ovh-font ovh-font-vRack',
      app: [DEDICATED],
      regions: ['EU', 'CA', 'US'],
      namespace: [undefined, HPC_NAMESPACE],
    },
    {
      id: 'cloud_connect',
      feature: 'cloud-connect',
      loadOnState: 'cloud-connect',
      types: [
        {
          path: '/ovhCloudConnect',
          state: 'cloud-connect.details',
          stateParams: ['ovhCloudConnectId'],
          app: [DEDICATED],
          regions: ['EU'],
          namespace: [undefined, HPC_NAMESPACE],
        },
      ],
      icon: 'oui-icon oui-icon-line-communicating_concept',
      app: [DEDICATED],
      namespace: [undefined, HPC_NAMESPACE],
    },
  ],
};

export const CLOUD_DESKTOP_CONFIG = {
  id: 'cloud_desktop',
  loadOnState: 'deskaas',
  types: [
    {
      path: '/deskaas',
      state: 'deskaas.details',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-cloud-desktop',
      app: [CLOUD],
      searchKeys: ['Cloud Desktop', 'deskaas', 'vdi'],
    },
  ],
  icon: 'ovh-font ovh-font-cloud-desktop',
  app: [CLOUD],
  regions: ['EU'],
};

export const SIDEBAR_CONFIG = [
  DEDICATED_SERVER_CONFIG,
  MANAGED_BAREMETAL_CONFIG,
  DEDICATED_CLOUD_CONFIG,
  NETWORKS_CONFIG,
  ENTERPRISE_CLOUD_DATABASE,

  // CLOUD IMPORT
  IAAS_CONFIG,
  PAAS_CONFIG,
  METRICS_CONFIG,
  LOGS_CONFIG,
  IPLB_CONFIG,
  DEDICATED_NETWORK_CONFIG,
  CLOUD_DESKTOP_CONFIG,

  // DEDICATED END
  MICROSOFT_CONFIG,
  LICENCE_CONFIG,
  IP_CONFIG,
];

export default { SIDEBAR_CONFIG };
