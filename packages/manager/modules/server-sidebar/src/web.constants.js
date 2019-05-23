import { WEB } from './constants';

export const DOMAIN_CONFIG = {
  id: 'domains',
  loadOnState: 'app.domain',
  types: [
    {
      path: '/domain',
      category: 'DOMAIN',
      state: 'app.domain.product',
      stateParams: ['productId'],
      app: [WEB],
    },
    {
      path: '/allDom',
      category: 'ALLDOM',
      state: 'app.domain.alldom',
      stateParams: ['productId'],
      app: [WEB],
    },
  ],
  icon: 'ovh-font ovh-font-domain',
  app: [WEB],
  regions: ['EU'],
};

export const HOSTING_CONFIG = {
  id: 'hostings',
  loadOnState: 'app.hosting',
  types: [
    {
      path: '/hosting/web',
      category: 'HOSTING',
      state: 'app.hosting',
      stateParams: ['productId'],
      app: [WEB],
    },
  ],
  icon: 'ovh-font ovh-font-server',
  app: [WEB],
  regions: ['EU'],
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
          app: [WEB],
          types: [
            {
              path: '/email/exchange/:organizationId/service',
              icon: 'ms-Icon ms-Icon--ExchangeLogo',
              state: 'app.microsoft.exchange',
              stateParams: ['organizationId', 'productId'], // TODO: state
              app: [WEB],
            },
          ],
        },
      ],
      loadOnState: 'app.microsoft.exchange',
      icon: 'ms-Icon ms-Icon--ExchangeLogo',
      app: [WEB],
    },
  ],
  loadOnState: 'app.microsoft',
  icon: 'ms-Icon ms-Icon--WindowsLogo',
  app: [WEB],
  regions: ['EU'],
};

export const MICROSOFT_CONFIG = {
  id: 'microsoft_exchange',
  types: [
    {
      path: '/email/exchange',
      icon: 'ms-Icon ms-Icon--ExchangeLogo',
      loadOnState: 'app.microsoft.exchange',
      stateParams: ['organization'],
      app: [WEB],
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
          app: [WEB],
        },
      ],
    },
  ],
  loadOnState: 'app.microsoft.exchange',
  icon: 'ms-Icon ms-Icon--ExchangeLogo',
  app: [WEB],
  regions: ['CA'],
};

export const WEB_SIDEBAR_CONFIG = [
  DOMAIN_CONFIG, HOSTING_CONFIG,
];
export const WEB_ORDER_SIDEBAR_CONFIG = [
  {
    id: 'order-pci-project-new',
    title: 'cloud_project',
    icon: 'ovh-font ovh-font-public-cloud',
    linkId: 'cloudProjectOrder',
    app: [WEB],
    regions: ['EU', 'CA', 'US'],
  },
  {
    id: 'order-nas',
    title: 'NAS',
    icon: 'ovh-font ovh-font-cloudnas',
    state: 'app.networks.nas.order',
    regions: ['EU'],
    app: [WEB],
  },

  {
    id: 'order-dedicated-server',
    title: 'dedicated_server',
    icon: 'ovh-font ovh-font-server',
    linkId: 'dedicatedOrder',
    target: '_blank',
    app: [WEB],
    regions: ['EU', 'CA', 'US'],
  },
  {
    id: 'order-vrack',
    title: 'vrack',
    icon: 'ovh-font ovh-font-vRack',
    linkId: 'vrackOrder',
    target: '_blank',
    app: [WEB],
    regions: ['EU', 'CA', 'US'],
  },
  {
    id: 'order-additional-ip',
    title: 'ip',
    icon: 'ovh-font ovh-font-ip',
    state: 'app.ip.agora-order',
    regions: ['EU', 'CA', 'US'],
    app: [WEB],
  },
  {
    id: 'order-license',
    title: 'licence',
    icon: 'ovh-font ovh-font-certificate',
    state: 'app.license.order',
    app: [WEB],
    regions: ['EU', 'CA', 'US'],
  },
];

export default { WEB_SIDEBAR_CONFIG, WEB_ORDER_SIDEBAR_CONFIG };
