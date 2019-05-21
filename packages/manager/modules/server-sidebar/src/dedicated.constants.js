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
          stateParams: [
            'productId',
            'domain',
          ],
          app: [DEDICATED],
          regions: ['EU'],
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
      regions: ['EU', 'CA'],
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
      regions: ['EU', 'CA'],
    },
  ],
  loadOnState: 'app.networks',
  icon: 'ovh-font ovh-font-network',
  app: [DEDICATED],
  regions: ['EU', 'CA'],
};

export const OLD_MICROSOFT_CONFIG = {
  id: 'microsoft',
  children: [
    {
      id: 'exchange',
      types: [
        {
          path: '/email/exchange',
          icon: 'ms-Icon ms-Icon--ExchangeLogo',
          loadOnState: 'app.microsoft.exchange',
          stateParams: ['organizationId'],
          app: [DEDICATED],
          types: [
            {
              path: '/email/exchange/:organizationId/service',
              icon: 'ms-Icon ms-Icon--ExchangeLogo',
              state: 'app.microsoft.exchange',
              stateParams: ['organizationId', 'productId'], // TODO: state
              app: [DEDICATED],
            },
          ],
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
          path: '/email/exchange/:organization/service',
          icon: 'ms-Icon ms-Icon--ExchangeLogo',
          getState: ({ offer }) => {
            const states = {
              provider: 'app.microsoft.exchange.provider',
              dedicated: 'app.microsoft.exchange.dedicated',
              dedicatedCluster: 'app.microsoft.exchange.dedicatedCluster',
              hosted: 'app.microsoft.exchange.hosted',
            };

            return states[offer];
          },
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
    regions: ['EU', 'CA', 'US'],
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
    regions: ['EU', 'CA', 'US'],
  },
  {
    id: 'order-vrack',
    title: 'vrack',
    icon: 'ovh-font ovh-font-vRack',
    linkId: 'vrackOrder',
    target: '_blank',
    app: [DEDICATED],
    regions: ['EU', 'CA', 'US'],
  },
  {
    id: 'order-additional-ip',
    title: 'ip',
    icon: 'ovh-font ovh-font-ip',
    state: 'app.ip.agora-order',
    regions: ['EU', 'CA', 'US'],
    app: [DEDICATED],
  },
  {
    id: 'order-license',
    title: 'licence',
    icon: 'ovh-font ovh-font-certificate',
    state: 'app.license.order',
    app: [DEDICATED],
    regions: ['EU', 'CA', 'US'],
  },
];

export default { DEDICATED_SIDEBAR_CONFIG, DEDICATED_ORDER_SIDEBAR_CONFIG };
