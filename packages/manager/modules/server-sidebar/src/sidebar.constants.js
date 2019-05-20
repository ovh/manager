import { DEDICATED, CLOUD } from './constants';

export const DEDICATED_SERVER_CONFIG = {
  id: 'dedicatedServers',
  loadOnState: 'app.dedicated',
  types: [
    {
      path: '/dedicated/server',
      category: 'SERVER',
      state: 'app.dedicated.server',
      stateParams: ['productId'],
      app: [DEDICATED],
    },
    {
      path: '/dedicated/housing',
      category: 'HOUSING',
      state: 'app.dedicated.housing',
      stateParams: ['productId'],
      app: [DEDICATED],
    },
  ],
  icon: 'ovh-font ovh-font-server',
  app: [DEDICATED],
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
          stateParams: [
            'productId',
            'datacenterId',
          ],
          app: [DEDICATED],
        },
      ],
      state: 'app.dedicatedClouds',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-dedicatedCloud',
      app: [DEDICATED],
    },
  ],
  loadOnState: 'app.dedicatedClouds',
  icon: 'ovh-font ovh-font-dedicatedCloud',
  app: [DEDICATED],
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
          stateParams: [
            'productId',
            'domain',
          ],
          app: [DEDICATED],
        },
      ],
      state: 'app.networks.cdn.dedicated',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-cdn',
      app: [DEDICATED],
    },
    {
      path: '/dedicated/nas',
      state: 'app.networks.cdn.dedicated',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [DEDICATED],
    },
    {
      path: '/dedicated/nasha',
      state: 'paas.nasha.nasha-partitions',
      stateParams: ['nashaId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [CLOUD],
    },
  ],
  loadOnState: 'app.networks',
  icon: 'ovh-font ovh-font-network',
  app: [DEDICATED],
};

export const MICROSOFT_CONFIG = {
  id: 'microsoft',
  children: [
    {
      id: 'exchange',
      types: [
        {
          path: '/email/exchange',
          icon: 'ms-Icon ms-Icon--ExchangeLogo',
          state: 'app.microsoft.exchange',
          stateParams: [],
          app: [DEDICATED],
        },
      ],
      loadOnState: 'app.microsoft.exchange',
      icon: 'ms-Icon ms-Icon--ExchangeLogo',
      app: [DEDICATED],
    },
  ],
  loadOnState: 'app.microsoft',
  icon: 'ms-Icon ms-Icon--WindowsLogo',
  app: [DEDICATED],
  // regions: ['CA'],
};

export const LICENCE_CONFIG = {
  id: 'licences',
  state: 'app.license.dashboard', // TODO : should be a link : CLOUD #/configuration/license?landingTo=licences
  icon: 'ovh-font ovh-font-certificate',
  url: '#/configuration/license?landingTo=licences',
  app: [DEDICATED],
};

export const IP_CONFIG = {
  id: 'ip',
  state: 'app.ip', // TODO : should be a link DEDICATED #/configuration/ip?landingTo=ip
  url: '#/configuration/ip?landingTo=ip',
  icon: 'ovh-font ovh-font-ip',
  app: [DEDICATED],
};

export const IAAS_CONFIG = {
  id: 'iaas',
  loadOnState: 'iaas',
  types: [
    {
      path: '/vps',
      state: 'iaas.vps.detail.dashboard',
      stateParams: ['serviceName'],
      loadOnState: 'iaas.vps.detail',
      icon: 'ovh-font ovh-font-vps',
      app: [CLOUD],
    },
  ],
  icon: 'ovh-font ovh-font-cloud-root',
  app: [CLOUD],
};

export const PAAS_CONFIG = {
  id: 'paas',
  loadOnState: 'paas',
  types: [
    {
      path: '/dedicated/ceph',
      state: 'paas.cda.cda-details.cda-details-home',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-cloud-disk-array',
      app: [CLOUD],
    },
    {
      path: '/dedicated/nasha',
      state: 'paas.nasha.nasha-partitions',
      stateParams: ['nashaId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [CLOUD],
    },
    {
      path: '/veeamCloudConnect',
      state: 'paas.veeam.detail.dashboard',
      stateParams: ['serviceName'],
      loadOnState: 'paas.veeam.detail',
      icon: 'ovh-font ovh-font-veeam',
      app: [CLOUD],
    },
    {
      path: '/veeam/veeamEnterprise',
      state: 'paas.veeam-enterprise.dashboard',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-veeam',
      app: [CLOUD],
    },
  ],
  icon: 'ovh-font ovh-font-cloud-package',
  app: [CLOUD],
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
    },
  ],
  icon: 'ovh-font ovh-font-graph',
  app: [CLOUD],
};

export const LOGS_CONFIG = {
  id: 'logs',
  loadOnState: 'dbaas.logs',
  types: [
    {
      path: '/dbaas/logs',
      state: 'dbaas.logs.detail',
      stateParams: ['serviceName'],
      app: [CLOUD],
    },
  ],
  children: [
    {
      id: 'logs_all_accounts',
      state: 'dbaas.logs', // TODO : should be a link
      url: '#/dbaas/logs',
      app: [CLOUD],
    },
  ],
  icon: 'fa fa-bar-chart',
  app: [CLOUD],
};

export const IPLB_CONFIG = {
  id: 'load_balancer',
  loadOnState: 'network.iplb',
  types: [
    {
      path: '/ipLoadbalancing',
      state: 'network.iplb.detail',
      stateParams: ['serviceName'],
      icon: 'ovh-font ovh-font-iplb',
      app: [CLOUD],
    },
  ],
  icon: 'ovh-font ovh-font-iplb',
  app: [CLOUD],
};

export const VRACK_CONFIG = {
  id: 'vrack',
  loadOnState: 'vrack',
  types: [
    {
      path: '/vrack',
      state: 'vrack',
      stateParams: ['vrackId'],
      app: [CLOUD],
    },
  ],
  icon: 'ovh-font ovh-font-vRack',
  app: [CLOUD],
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
    },
  ],
  icon: 'ovh-font ovh-font-cloud-desktop',
  app: [CLOUD],
};

export const SIDEBAR_CONFIG = [
  DEDICATED_SERVER_CONFIG,
  DEDICATED_CLOUD_CONFIG,
  NETWORKS_CONFIG,

  // CLOUD IMPORT
  IAAS_CONFIG,
  PAAS_CONFIG,
  METRICS_CONFIG,
  LOGS_CONFIG,
  IPLB_CONFIG,
  VRACK_CONFIG,
  CLOUD_DESKTOP_CONFIG,

  // DEDICATED END
  MICROSOFT_CONFIG,
  LICENCE_CONFIG,
  IP_CONFIG,
];

export default { SIDEBAR_CONFIG };
