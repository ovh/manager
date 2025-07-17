import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import illustration from '@/assets/images/sidebar/web-cloud.png';
import { Node } from '../node';

const webCloudUniverse: Node = {
  id: 'web-cloud',
  idAttr: 'web-cloud-link',
  translation: 'sidebar_web_cloud',
  shortTranslation: 'sidebar_web_cloud_short',
  illustration,
  svgIcon: OvhProductName.MONITOR,
  routing: {
    application: 'web',
    hash: '#/',
  },
  features: ['web'],
};

webCloudUniverse.children = [
  {
    id: 'domain-dns',
    idAttr: 'domain-dns-link',
    universe: webCloudUniverse.id,
    translation: 'sidebar_domain_dns',
    features: [
      'web:domains',
      'web:domains:zone',
      'web-ongoing-operations',
      'web-domains:alldoms',
    ],
    children: [
      {
        id: 'domains-operations',
        idAttr: 'domains-operations-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_domain_operations',
        routing: {
          application: 'web-ongoing-operations',
          hash: '#/',
        },
        features: ['web-ongoing-operations'],
      },
      {
        id: 'domains',
        idAttr: 'domains-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_domain',
        serviceType: 'DOMAIN',
        routing: {
          application: 'web',
          hash: '#/domain',
        },
        features: ['web:domains'],
      },
      {
        id: 'alldom',
        idAttr: 'alldom-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_alldom',
        routing: {
          application: 'web-domains',
          hash: '#/alldoms',
        },
        serviceType: 'ALLDOM',
        features: ['web-domains:alldoms'],
        hideIfEmpty: true
      },
      {
        id: 'dns',
        idAttr: 'dns-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_dns',
        serviceType: 'DOMAIN_ZONE',
        routing: {
          application: 'web',
          hash: '#/zone',
        },
        features: ['web:domains:zone'],
      },
    ],
  },
  {
    id: 'web-hosting',
    idAttr: 'web-hosting-link',
    universe: webCloudUniverse.id,
    translation: 'sidebar_web_hosting',
    features: ['hosting', 'private-database'],
    children: [
      {
        id: 'hosting',
        idAttr: 'hosting-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_hosting',
        serviceType: 'HOSTING_WEB',
        routing: {
          application: 'web',
          hash: '#/hosting',
        },
        features: ['hosting'],
      },
      {
        id: 'website',
        idAttr: 'hosting-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_web_hosting_websites',
        serviceType: 'WEB_HOSTING',
        routing: {
          application: 'web-hosting',
          hash: '#/',
        },
        features: ['web-hosting:websites'],
      },
      {
        id: 'web-databases',
        idAttr: 'web-databases-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_web_db',
        serviceType: 'HOSTING_PRIVATEDATABASE',
        routing: {
          application: 'web',
          hash: '#/private_database',
        },
        features: ['private-database'],
      },
      {
        id: 'wordpress-managed',
        idAttr: 'wordpress-managed-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_web_hosting_wordpress_managed',
        serviceType: 'WEB_HOSTING',
        routing: {
          application: 'web-hosting',
          hash: '#/wordpress-managed',
        },
        features: ['web-hosting:wordpress-managed'],
      },
    ],
  },
  {
    id: 'emails',
    idAttr: 'emails-link',
    universe: webCloudUniverse.id,
    translation: 'sidebar_emails',
    features: ['email-pro', 'emails:mxplan', 'zimbra'],
    children: [
      {
        id: 'zimbra',
        idAttr: 'zimbra-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_zimbra',
        routing: {
          application: 'zimbra',
          hash: '#/',
        },
        features: ['zimbra'],
      },
      {
        id: 'email-pro',
        idAttr: 'email-pro-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_email_pro',
        serviceType: 'EMAIL_PRO',
        routing: {
          application: 'web',
          hash: '#/email_pro',
        },
        features: ['email-pro'],
      },
      {
        id: 'mxplan',
        idAttr: 'mxplan-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_mxplan',
        serviceType: 'EMAIL_DOMAIN',
        routing: {
          application: 'web',
          hash: '#/email_domain',
        },
        features: ['emails:mxplan'],
      },
      {
        id: 'email-delegated',
        idAttr: 'email-delegated-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_email_delegated',
        serviceType: 'EMAIL_DELEGATED',
        routing: {
          application: 'web',
          hash: '#/email_delegate',
        },
        features: ['emails:delegate'],
      },
    ],
  },
  {
    id: 'microsoft',
    idAttr: 'microsoft-link',
    universe: webCloudUniverse.id,
    translation: 'sidebar_microsoft',
    features: ['web-office', 'exchange'],
    children: [
      {
        id: 'web-office',
        idAttr: 'web-office-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_license_office',
        serviceType: 'LICENSE_OFFICE',
        routing: {
          application: 'web-office',
          hash: '#/',
        },
        features: ['web-office'],
      },
      {
        id: 'exchange',
        idAttr: 'exchange-link',
        universe: webCloudUniverse.id,
        translation: 'sidebar_exchange',
        serviceType: 'EMAIL_EXCHANGE_SERVICE',
        routing: {
          application: 'web',
          hash: '#/exchange',
        },
        features: ['exchange'],
      },
    ],
  },
];

export default webCloudUniverse;
