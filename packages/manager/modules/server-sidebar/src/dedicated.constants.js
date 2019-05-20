import { DEDICATED } from './constants';

export const DEDICATED_SERVER_CONFIG = {
  id: 'dedicatedServers',
  loadOnState: 'app.dedicated',
  types: [
    {
      path: '/dedicated/housing',
      category: 'HOUSING',
      state: 'app.dedicated.housing',
      stateParams: ['productId'],
      app: [DEDICATED],
    },
    {
      path: '/dedicated/server',
      category: 'SERVER',
      state: 'app.dedicated.server',
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
      regions: ['EU'],
    },
    {
      path: '/dedicated/nas',
      state: 'app.networks.nas.details',
      stateParams: ['nasId'],
      icon: 'ovh-font ovh-font-cloudnas',
      app: [DEDICATED],
      regions: ['EU'],
    },
    {
      path: '/dedicated/nasha',
      state: 'app.networks.nas.details',
      stateParams: ['nasId'],
      stateParamsTransformer: params => ({
        ...params,
        nasType: 'nas',
        nasId: `nasha_${params.nasId}`,
      }),
      icon: 'ovh-font ovh-font-cloudnas',
      app: [DEDICATED],
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
  regions: ['CA'],
};

export const LICENCE_CONFIG = {
  id: 'licences',
  state: 'app.license.dashboard',
  icon: 'ovh-font ovh-font-certificate',
  app: [DEDICATED],
};

export const IP_CONFIG = {
  id: 'ip',
  state: 'app.ip',
  icon: 'ovh-font ovh-font-ip',
  app: [DEDICATED],
};

export const DEDICATED_SIDEBAR_CONFIG = [
  DEDICATED_SERVER_CONFIG,
  DEDICATED_CLOUD_CONFIG,
  NETWORKS_CONFIG,
  // DEDICATED END
  MICROSOFT_CONFIG,
  LICENCE_CONFIG,
  IP_CONFIG,
];
export const DEDICATED_ORDER_SIDEBAR_CONFIG = [
  {
    id: 'order-pci-project-new',
    title: 'cloud_project',
    icon: 'ovh-font ovh-font-public-cloud',
    linkId: 'cloudProjectOrder',
    app: [DEDICATED],
  },
  {
    id: 'order-nas',
    title: 'NAS',
    icon: 'ovh-font ovh-font-cloudnas',
    state: 'app.networks.nas.order',
    regions: ['EU'],
    app: [DEDICATED],
  },

  {
    id: 'order-dedicated-server',
    title: 'dedicated_server',
    icon: 'ovh-font ovh-font-server',
    linkId: 'dedicatedOrder',
    target: '_blank',
    app: [DEDICATED],
  },
  {
    id: 'order-vrack',
    title: 'vrack',
    icon: 'ovh-font ovh-font-vRack',
    linkId: 'vrackOrder',
    target: '_blank',
    regions: ['US'],
    app: [DEDICATED],
  },
  {
    id: 'order-additional-ip',
    title: 'ip',
    icon: 'ovh-font ovh-font-ip',
    state: 'app.ip.agora-order',
    regions: ['US'],
    app: [DEDICATED],
  },
  {
    id: 'order-license',
    title: 'licence',
    icon: 'ovh-font ovh-font-certificate',
    state: 'app.license.order',
    app: [DEDICATED],
  },
];

export default { DEDICATED_SIDEBAR_CONFIG, DEDICATED_ORDER_SIDEBAR_CONFIG };
