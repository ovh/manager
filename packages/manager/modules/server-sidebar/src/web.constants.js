import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { WEB } from './constants';

export const DOMAIN_CONFIG = {
  id: 'domains',
  loadOnState: 'app.domain',
  children: [
    {
      id: 'domain_bulk',
      state: 'app.domain.all',
      stateUrl: '#/domain/bulk',
      icon: 'ovh-font ovh-font-network',
      app: [WEB],
    },
    {
      id: 'domain_operations',
      state: 'app.domain.operation',
      stateUrl: '#/domain/operations',
      icon: 'ovh-font ovh-font-config',
      app: [WEB],
    },
  ],
  types: [
    {
      path: '/allDom',
      category: 'ALLDOM',
      loadOnState: 'app.alldom.domain',
      stateParams: ['productId'],
      loadOnStateParams: ['allDom'],
      app: [WEB],
      regions: ['EU'],
      icon: 'ovh-font ovh-font-domain',
      types: [
        {
          path: '/allDom/:productId/domain',
          category: 'ALLDOM',
          state: 'app.alldom.domain',
          stateParams: ['allDom', 'productId'],
          app: [WEB],
          icon: 'ovh-font ovh-font-domain',
        },
      ],
    },
    {
      path: '/domain',
      category: 'DOMAIN',
      state: 'app.domain.product',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-domain',
      app: [WEB],
      filter: {
        category: 'ALLDOM',
        fn: (items, compareTo) => {
          const allDoms = map(get(compareTo, 'items', []), 'serviceName');
          return items.filter(
            (item) => !item.parentName || !includes(allDoms, item.parentName),
          );
        },
      },
    },
    {
      path: '/domain/zone',
      category: 'ZONE',
      state: 'app.zone.details',
      stateParams: ['productId'],
      icon: 'oui-icon oui-icon-domain-dns',
      app: [WEB],
      filter: {
        category: 'DOMAIN',
        fn: (items, compareTo) =>
          items.filter((it) =>
            isEmpty(
              find(get(compareTo, 'items', []), {
                serviceName: it.serviceName,
              }),
            ),
          ),
      },
    },
  ],
  icon: 'ovh-font ovh-font-domain',
  app: [WEB],
  regions: ['EU', 'CA'],
};

export const HOSTING_CONFIG = {
  id: 'hostings',
  loadOnState: 'app.hosting.dashboard',
  types: [
    {
      path: '/hosting/web',
      category: 'HOSTING',
      state: 'app.hosting.dashboard',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-server',
      app: [WEB],
    },
  ],
  icon: 'ovh-font ovh-font-hosting',
  app: [WEB],
  regions: ['EU', 'CA'],
};

export const PRIVATE_DATABASE_CONFIG = {
  id: 'privateDatabases',
  loadOnState: 'app.private-database.dashboard',
  types: [
    {
      path: '/hosting/privateDatabase',
      category: 'PRIVATE_DATABASE',
      state: 'app.private-database.dashboard',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-database',
      app: [WEB],
    },
  ],
  icon: 'ovh-font ovh-font-database',
  app: [WEB],
  regions: ['EU', 'CA'],
};

export const EMAIL_PRO_CONFIG = {
  id: 'emailPros',
  loadOnState: 'email-pro.dashboard',
  types: [
    {
      path: '/email/pro',
      category: 'EMAIL_PRO',
      state: 'email-pro.dashboard',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-mail',
      app: [WEB],
    },
  ],
  icon: 'ovh-font ovh-font-mail',
  app: [WEB],
  regions: ['EU'],
};

export const EMAIL_CONFIG = {
  id: 'emails',
  loadOnState: 'app.email.*',
  types: [
    {
      path: '/email/domain',
      category: 'EMAIL_DOMAIN',
      state: 'app.email.domain',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-mail',
      app: [WEB],
      regions: ['EU'],
    },
    {
      path: '/email/mxplan',
      category: 'EMAIL_MXPLAN',
      state: 'mxplan.dashboard',
      stateParams: ['productId'],
      loadOnState: 'mxplan.dashboard',
      icon: 'ovh-font ovh-font-mail',
      app: [WEB],
      regions: ['EU', 'CA'],
    },
    {
      path: '/email/domain/delegatedAccount',
      category: 'EMAIL_DELEGATE',
      state: 'app.email.delegate',
      stateParams: ['productId'],
      loadOnState: 'app.email.delegate',
      icon: 'ovh-font ovh-font-mail',
      app: [WEB],
      regions: ['EU'],
    },
  ],
  icon: 'ovh-font ovh-font-mail',
  app: [WEB],
  regions: ['EU', 'CA'],
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
          state: 'exchange.dashboard',
          stateParams: ['organization', 'productId'],
          app: [WEB],
        },
      ],
      loadOnState: 'exchange.dashboard',
      icon: 'ms-Icon ms-Icon--ExchangeLogo',
      app: [WEB],
    },
    {
      id: 'office',
      types: [
        {
          path: '/license/office',
          icon: 'ms-Icon ms-Icon--OfficeLogo',
          state: 'office.product',
          stateParams: ['serviceName'],
          app: [WEB],
        },
      ],
      loadOnState: 'office',
      icon: 'ms-Icon ms-Icon--OfficeLogo',
      app: [WEB],
    },
    {
      id: 'sharepoint',
      types: [
        {
          path: '/msServices/*/sharepoint',
          icon: 'ms-Icon ms-Icon--SharepointLogo',
          state: 'sharepoint.product',
          stateParams: ['exchangeId', 'productId'],
          app: [WEB],
        },
      ],
      loadOnState: 'sharepoint',
      icon: 'ms-Icon ms-Icon--SharepointLogo',
      app: [WEB],
    },
  ],
  loadOnState: 'app.microsoft',
  icon: 'ms-Icon ms-Icon--WindowsLogo',
  forceDisplaySearch: true,
  app: [WEB],
  regions: ['EU'],
};

export const WEB_SIDEBAR_CONFIG = [
  DOMAIN_CONFIG,
  HOSTING_CONFIG,
  PRIVATE_DATABASE_CONFIG,
  EMAIL_PRO_CONFIG,
  EMAIL_CONFIG,
  MICROSOFT_CONFIG,
];

export const WEB_ORDER_SIDEBAR_CONFIG = [
  {
    id: 'orderDomain',
    title: 'domain',
    icon: 'ovh-font ovh-font-domain',
    linkId: 'orderDomain',
    target: '_blank',
    app: [WEB],
    regions: ['EU', 'CA'],
  },
  {
    id: 'orderZone',
    title: 'zone',
    icon: 'oui-icon oui-icon-domain-dns',
    state: 'app.dns-zone-new',
    regions: ['EU', 'CA'],
    app: [WEB],
  },
  {
    id: 'orderHosting',
    title: 'hosting',
    icon: 'ovh-font ovh-font-hosting',
    linkId: 'orderHosting',
    target: '_blank',
    app: [WEB],
    regions: ['EU', 'CA'],
  },
  {
    id: 'orderCloudWeb',
    title: 'cloudWeb',
    icon: 'ovh-font ovh-font-hosting',
    linkId: 'orderCloudWeb',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
  },
  {
    id: 'orderEmailPro',
    title: 'emailPro',
    icon: 'ovh-font ovh-font-mail',
    linkId: 'orderEmailPro',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
  },
  {
    id: 'orderMXPlan',
    title: 'mxplan',
    icon: 'ovh-font ovh-font-mail',
    state: 'app.mx-plan',
    regions: ['EU'],
    app: [WEB],
  },
  {
    id: 'orderExchange',
    title: 'exchange',
    icon: 'ms-Icon ms-Icon--ExchangeLogo',
    state: 'exchange.order',
    regions: ['EU'],
    app: [WEB],
  },
  {
    id: 'orderOffice',
    title: 'office',
    icon: 'ms-Icon ms-Icon--OfficeLogo',
    linkId: 'orderOffice',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
  },
  {
    id: 'orderCsp2',
    title: 'csp2',
    icon: 'ms-Icon ms-Icon--OfficeLogo',
    linkId: 'orderCsp2',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
  },
  {
    id: 'orderSharepoint',
    title: 'sharepoint',
    icon: 'ms-Icon ms-Icon--SharepointLogo',
    state: 'sharepoint.order',
    regions: ['EU'],
    app: [WEB],
  },
  {
    id: 'orderCloudDatabase',
    title: 'cloudDatabase',
    icon: 'ovh-font ovh-font-database',
    state: 'app.private-database-order-clouddb',
    regions: ['EU'],
    app: [WEB],
  },
];

export default { WEB_SIDEBAR_CONFIG, WEB_ORDER_SIDEBAR_CONFIG };
