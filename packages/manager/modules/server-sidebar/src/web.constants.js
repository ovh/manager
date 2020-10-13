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
      id: 'domain_all',
      state: 'app.domain.all',
      stateUrl: '#/configuration/domains',
      icon: 'ovh-font ovh-font-network',
      app: [WEB],
    },
    {
      id: 'domain_operations',
      state: 'app.domain.operation',
      stateUrl: '#/configuration/domains_operations',
      icon: 'ovh-font ovh-font-config',
      app: [WEB],
    },
  ],
  types: [
    {
      path: '/allDom',
      category: 'ALLDOM',
      loadOnState: 'app.domain.alldom',
      stateParams: ['productId'],
      loadOnStateParams: ['allDom'],
      app: [WEB],
      regions: ['EU'],
      icon: 'ovh-font ovh-font-domain',
      types: [
        {
          path: '/allDom/:productId/domain',
          category: 'ALLDOM',
          state: 'app.domain.alldom',
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
      state: 'app.domain.dns-zone',
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
  loadOnState: 'app.hosting',
  types: [
    {
      path: '/hosting/web',
      category: 'HOSTING',
      state: 'app.hosting',
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
  loadOnState: 'app.private-database',
  types: [
    {
      path: '/hosting/privateDatabase',
      category: 'PRIVATE_DATABASE',
      state: 'app.private-database',
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
  loadOnState: 'app.email-pro',
  types: [
    {
      path: '/email/pro',
      category: 'EMAIL_PRO',
      state: 'app.email-pro',
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
      state: 'app.email.mxplan',
      stateParams: ['productId'],
      loadOnState: 'app.email.mxplan',
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
          state: 'app.exchange',
          stateParams: ['organization', 'productId'],
          app: [WEB],
        },
      ],
      loadOnState: 'app.microsoft.exchange',
      icon: 'ms-Icon ms-Icon--ExchangeLogo',
      app: [WEB],
    },
    {
      id: 'office',
      types: [
        {
          path: '/license/office',
          icon: 'ms-Icon ms-Icon--OfficeLogo',
          state: 'app.microsoft.office.product',
          stateParams: ['serviceName'],
          app: [WEB],
        },
      ],
      loadOnState: 'app.microsoft.office',
      icon: 'ms-Icon ms-Icon--OfficeLogo',
      app: [WEB],
    },
    {
      id: 'sharepoint',
      types: [
        {
          path: '/msServices/*/sharepoint',
          icon: 'ms-Icon ms-Icon--SharepointLogo',
          state: 'app.microsoft.sharepoint.product',
          stateParams: ['exchangeId', 'productId'],
          app: [WEB],
        },
      ],
      loadOnState: 'app.microsoft.sharepoint',
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
    tracker: 'web::orders::domain-name::order',
  },
  {
    id: 'orderZone',
    title: 'zone',
    icon: 'oui-icon oui-icon-domain-dns',
    state: 'app.dns-zone-new',
    regions: ['EU', 'CA'],
    app: [WEB],
    tracker: 'web::orders::dns-zone::order',
  },
  {
    id: 'orderHosting',
    title: 'hosting',
    icon: 'ovh-font ovh-font-hosting',
    linkId: 'orderHosting',
    target: '_blank',
    app: [WEB],
    regions: ['EU', 'CA'],
    tracker: 'web::orders::web-hosting::order',
  },
  {
    id: 'orderCloudWeb',
    title: 'cloudWeb',
    icon: 'ovh-font ovh-font-hosting',
    linkId: 'orderCloudWeb',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
    tracker: 'web::orders::cloud-web::order',
  },
  {
    id: 'orderEmailPro',
    title: 'emailPro',
    icon: 'ovh-font ovh-font-mail',
    linkId: 'orderEmailPro',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
    tracker: 'web::orders::email-pro::order',
  },
  {
    id: 'orderMXPlan',
    title: 'mxplan',
    icon: 'ovh-font ovh-font-mail',
    state: 'app.mx-plan',
    regions: ['EU'],
    app: [WEB],
    tracker: 'web::orders::mx-plan::order',
  },
  {
    id: 'orderExchange',
    title: 'exchange',
    icon: 'ms-Icon ms-Icon--ExchangeLogo',
    state: 'app.microsoft.exchange.order',
    regions: ['EU'],
    app: [WEB],
    tracker: 'web::orders::email-microsoft-exchange::order',
  },
  {
    id: 'orderOffice',
    title: 'office',
    icon: 'ms-Icon ms-Icon--OfficeLogo',
    linkId: 'orderOffice',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
    tracker: 'web::orders::licences-office::order',
  },
  {
    id: 'orderCsp2',
    title: 'csp2',
    icon: 'ms-Icon ms-Icon--OfficeLogo',
    linkId: 'orderCsp2',
    target: '_blank',
    app: [WEB],
    regions: ['EU'],
    tracker: 'web::orders::licences-office-reseller::order',
  },
  {
    id: 'orderSharepoint',
    title: 'sharepoint',
    icon: 'ms-Icon ms-Icon--SharepointLogo',
    state: 'app.microsoft.sharepoint.order',
    regions: ['EU'],
    app: [WEB],
    tracker: 'web::orders::microsoft-sharepoint::order',
  },
  {
    id: 'orderCloudDatabase',
    title: 'cloudDatabase',
    icon: 'ovh-font ovh-font-database',
    state: 'app.private-database-order-clouddb',
    regions: ['EU'],
    app: [WEB],
    tracker: 'web::orders::cloud-db::order',
  },
  {
    id: 'orderPrivateDatabase',
    title: 'privateDatabase',
    icon: 'ovh-font ovh-font-database',
    state: 'app.private-database-order',
    regions: ['EU', 'CA'],
    app: [WEB],
  },
];

export default { WEB_SIDEBAR_CONFIG, WEB_ORDER_SIDEBAR_CONFIG };
