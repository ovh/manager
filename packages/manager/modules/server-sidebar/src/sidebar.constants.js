import { DEDICATED, HPC_NAMESPACE } from './constants';

export const DEDICATED_SERVER_CONFIG = {
  id: 'dedicatedServers',
  loadOnState: ['dedicated-housing', 'app.dedicated-server'],
  children: [
    {
      id: 'servers_all',
      state: 'app.dedicated-server.index',
      stateUrl: '#/configuration/servers',
      icon: 'ovh-font ovh-font-server',
      app: [DEDICATED],
    },
  ],
  types: [
    {
      path: '/dedicated/housing',
      category: 'HOUSING',
      state: 'dedicated-housing.dashboard',
      stateParams: ['productId'],
      app: [DEDICATED],
      searchKeys: ['HOUSING'],
    },
    {
      path: '/dedicated/server',
      category: 'SERVER',
      state: 'app.dedicated-server.server',
      stateParams: ['productId'],
      app: [DEDICATED],
      searchKeys: ['SERVER'],
    },
  ],
  icon: 'ovh-font ovh-font-server',
  app: [DEDICATED],
  feature: 'dedicated-server',
};

export const DEDICATED_CLOUD_CONFIG = {
  id: 'dedicatedClouds',
  types: [
    {
      path: '/dedicatedCloud',
      types: [
        {
          path: '/dedicatedCloud/:productId/datacenter',
          state: 'app.dedicatedCloud.details.datacenter.details',
          stateParams: ['productId', 'datacenterId'],
          app: [DEDICATED],
          namespace: HPC_NAMESPACE,
          subType: 'EPCC',
        },
      ],
      state: 'app.dedicatedCloud.details',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-dedicatedCloud',
      app: [DEDICATED],
      namespace: HPC_NAMESPACE,
      subType: 'EPCC',
    },
  ],
  loadOnState: 'app.dedicatedCloud.details',
  icon: 'ovh-font ovh-font-dedicatedCloud',
  app: [DEDICATED],
  namespace: HPC_NAMESPACE,
  feature: 'dedicated-cloud',
};

export const MANAGED_BAREMETAL_CONFIG = {
  id: 'managedBaremetal',
  types: [
    {
      path: '/dedicatedCloud',
      types: [
        {
          path: '/dedicatedCloud/:productId/datacenter',
          state: 'app.managedBaremetal.details.datacenters.datacenter',
          stateParams: ['productId', 'datacenterId'],
          app: [DEDICATED],
          subType: 'MBM',
        },
      ],
      state: 'app.managedBaremetal.details',
      stateParams: ['productId'],
      icon: 'oui-icon oui-icon-cloud-essential_concept',
      app: [DEDICATED],
      subType: 'MBM',
    },
  ],
  loadOnState: 'app.managedBaremetal.details',
  icon: 'oui-icon oui-icon-cloud-essential_concept',
  app: [DEDICATED],
  feature: 'managed-bare-metal',
};

export const NETWORKS_CONFIG = {
  id: 'networks',
  types: [
    {
      path: '/cdn/dedicated',
      types: [
        {
          path: '/cdn/dedicated/:productId/domains',
          state: 'app.networks.cdn.dedicated.manage.domain.dashboard',
          stateParams: ['productId', 'domain'],
          app: [DEDICATED],
        },
      ],
      state: 'app.networks.cdn.dedicated',
      loadOnState: 'app.networks.cdn.dedicated',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-cdn',
      app: [DEDICATED],
      searchKeys: ['Content Delivery Network'],
      feature: 'dedicated-cdn',
    },
    {
      path: '/dedicated/nas',
      state: 'app.dedicated-nas.details',
      stateParams: ['nasId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [DEDICATED],
      searchKeys: ['NAS'],
      feature: 'dedicated-nas',
    },
    {
      path: '/dedicated/nasha',
      state: 'nasha.dashboard.nasha-partitions',
      stateParams: ['nashaId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [DEDICATED],
      searchKeys: ['NAS', 'NASHA', 'NAS-HA'],
      feature: 'dedicated-nasha',
    },
  ],
  loadOnState: [
    'nasha.dashboard.nasha-partitions',
    'app.networks',
    'dedicated-nas',
  ],
  icon: 'ovh-font ovh-font-network',
  app: [DEDICATED],
  feature: 'dedicated-networks',
};

export const ENTERPRISE_CLOUD_DATABASE = {
  app: [DEDICATED],
  icon: 'ovh-font ovh-font-database',
  id: 'enterprise_cloud_database',
  state: 'enterprise-cloud-database',
  stateUrl: '#/enterprise-cloud-database',
  feature: 'enterprise-cloud-database',
};

export const MICROSOFT_CONFIG = {
  id: 'microsoft_exchange',
  types: [
    {
      path: '/email/exchange',
      icon: 'ms-Icon ms-Icon--ExchangeLogo',
      loadOnState: 'exchange.dashboard',
      stateParams: ['organization'],
      app: [DEDICATED],
      types: [
        {
          path: '/email/exchange',
          icon: 'ms-Icon ms-Icon--ExchangeLogo',
          state: 'exchange.dashboard',
          stateParams: ['organization', 'productId'],
          app: [DEDICATED],
        },
      ],
    },
  ],
  loadOnState: 'exchange',
  icon: 'ms-Icon ms-Icon--ExchangeLogo',
  app: [DEDICATED],
  regions: ['CA'],
  feature: 'exchange:dedicated-dashboard',
};

export const LICENCE_CONFIG = {
  id: 'licences',
  state: 'app.license.dashboard',
  icon: 'ovh-font ovh-font-certificate',
  stateUrl: '#/configuration/license?landingTo=licences',
  app: [DEDICATED],
  feature: 'license',
};

export const IP_CONFIG = {
  id: 'ip',
  state: 'app.ip',
  stateUrl: '#/configuration/ip?landingTo=ip',
  icon: 'ovh-font ovh-font-ip',
  app: [DEDICATED],
  namespace: [undefined, HPC_NAMESPACE],
  feature: 'ip',
};

export const VPS_CONFIG = {
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
  feature: 'vps',
};

export const PAAS_CONFIG = {
  id: 'paas',
  loadOnState: [
    'cda',
    'paas.veeam.detail',
    'veeam-cloud-connect',
    'veeam-enterprise.details',
  ],
  types: [
    {
      path: '/dedicated/ceph',
      state: 'cda.dashboard.cda-details-home',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-cloud-disk-array',
      app: [DEDICATED],
      searchKeys: ['Cloud Disk Array', 'CDA'],
      namespace: [undefined],
      feature: 'cloud-disk-array',
    },
    {
      path: '/veeamCloudConnect',
      state: 'veeam-cloud-connect.detail.dashboard',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-veeam',
      app: [DEDICATED],
      searchKeys: ['Veeam Cloud Connect', 'VEEAM'],
      namespace: [undefined],
      feature: 'veeam-cloud-connect',
    },
    {
      path: '/veeam/veeamEnterprise',
      state: 'veeam-enterprise.details.dashboard',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-veeam',
      app: [DEDICATED],
      searchKeys: ['Veeam Enterprise', 'VEEAM_ENTERPRISE'],
      namespace: [HPC_NAMESPACE],
      feature: 'veeam-enterprise',
    },
  ],
  icon: 'ovh-font ovh-font-cloud-package',
  app: [DEDICATED],
  feature: 'paas',
  namespace: [undefined, HPC_NAMESPACE],
};

export const METRICS_CONFIG = {
  id: 'metrics',
  loadOnState: 'metrics',
  types: [
    {
      path: '/metrics',
      state: 'metrics.detail.dashboard',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-graph',
      app: [DEDICATED],
      searchKeys: ['IOT', 'Metrics', 'Monitoring', 'Time Series', 'TimeSeries'],
    },
  ],
  icon: 'ovh-font ovh-font-graph',
  app: [DEDICATED],
  feature: 'metrics',
};

export const LOGS_CONFIG = {
  id: 'logs',
  loadOnState: 'dbaas-logs',
  state: 'dbaas-logs',
  stateUrl: '#/dbaas/logs',
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
  feature: 'logs-data-platform',
};

export const IPLB_CONFIG = {
  id: 'load_balancer',
  loadOnState: 'iplb',
  types: [
    {
      path: '/ipLoadbalancing',
      state: 'iplb.detail.home',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-iplb',
      app: [DEDICATED],
      searchKeys: ['IP Load Balancer', 'IPLB'],
    },
  ],
  icon: 'ovh-font ovh-font-iplb',
  app: [DEDICATED],
  feature: 'ip-load-balancer',
};

export const DEDICATED_NETWORK_CONFIG = {
  id: 'dedicated_network',
  forceDisplaySearch: true,
  app: [DEDICATED],
  namespace: [undefined, HPC_NAMESPACE],
  icon: 'oui-icon oui-icon-bandwidth_concept',
  loadOnState: ['vrack.dashboard', 'cloud-connect'],
  feature: 'dedicated-network',
  children: [
    {
      id: 'vrack',
      feature: 'vrack:bare-metal-cloud',
      loadOnState: 'vrack',
      types: [
        {
          path: '/vrack',
          state: 'vrack.dashboard',
          stateParams: ['vrackId'],
          app: [DEDICATED],
          namespace: [undefined],
        },
      ],
      icon: 'ovh-font ovh-font-vRack',
      app: [DEDICATED],
      namespace: [undefined],
    },
    {
      id: 'vrack',
      feature: 'vrack:hosted-private-cloud',
      loadOnState: 'vrack',
      types: [
        {
          path: '/vrack',
          state: 'vrack.dashboard',
          stateParams: ['vrackId'],
          app: [DEDICATED],
          namespace: [HPC_NAMESPACE],
        },
      ],
      icon: 'ovh-font ovh-font-vRack',
      app: [DEDICATED],
      namespace: [HPC_NAMESPACE],
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
          namespace: [undefined, HPC_NAMESPACE],
        },
      ],
      icon: 'oui-icon oui-icon-line-communicating_concept',
      app: [DEDICATED],
      namespace: [undefined, HPC_NAMESPACE],
    },
  ],
};

export const NUTANIX_CONFIG = {
  id: 'nutanix',
  types: [
    {
      path: '/nutanix',
      types: [
        {
          path: '/nutanix/:serviceName',
          state: 'nutanix.details.nodes.node',
          stateParams: ['serviceName', 'nodeId'],
          app: [DEDICATED],
          namespace: HPC_NAMESPACE,
        },
      ],
      state: 'nutanix.index',
      stateParams: ['serviceName'],
      icon: 'oui-icon oui-icon-nutanix_concept',
      app: [DEDICATED],
      namespace: HPC_NAMESPACE,
    },
  ],
  loadOnState: 'nutanix.index',
  icon: 'oui-icon oui-icon-nutanix_concept',
  app: [DEDICATED],
  namespace: HPC_NAMESPACE,
  feature: 'nutanix',
};

export const SIDEBAR_CONFIG = [
  DEDICATED_SERVER_CONFIG,
  VPS_CONFIG,
  MANAGED_BAREMETAL_CONFIG,
  DEDICATED_CLOUD_CONFIG,
  NETWORKS_CONFIG,
  ENTERPRISE_CLOUD_DATABASE,
  NUTANIX_CONFIG,

  // CLOUD IMPORT
  PAAS_CONFIG,
  METRICS_CONFIG,
  LOGS_CONFIG,
  IPLB_CONFIG,
  DEDICATED_NETWORK_CONFIG,

  // DEDICATED END
  MICROSOFT_CONFIG,
  LICENCE_CONFIG,
  IP_CONFIG,
];

export default { SIDEBAR_CONFIG };
