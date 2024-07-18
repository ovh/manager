import illustration from '@/assets/images/sidebar/web-cloud.png';
import { Node } from "../node";

const webCloudUniverse : Node = {
  id: 'web-cloud',
  translation: 'sidebar_web_cloud',
  shortTranslation: 'sidebar_web_cloud_short',
  illustration,
  routing: {
    application: 'web',
    hash: '#/',
  },
  features: ['web']
};

webCloudUniverse.children = [
    {
      id: 'domain-dns',
      universe: webCloudUniverse.id,
      translation: 'sidebar_domain_dns',
      features: ['web:domains', 'web:domains:zone'],
      count: false,
      children: [
        {
          id: 'domains-operations',
          universe: webCloudUniverse.id,
          translation: 'sidebar_domain_operations',
          routing: {
            application: 'web',
            hash: '#/domain/operation',
          },
          count: false,
          features: ['web:domains'],
        },
        {
          id: 'domains',
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
          id: 'dns',
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
      universe: webCloudUniverse.id,
      translation: 'sidebar_web_hosting',
      features: ['hosting', 'private-database'],
      children: [
        {
          id: 'hosting',
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
          id: 'web-databases',
          universe: webCloudUniverse.id,
          translation: 'sidebar_web_db',
          serviceType: 'HOSTING_PRIVATEDATABASE',
          routing: {
            application: 'web',
            hash: '#/private_database',
          },
          features: ['private-database'],
        },
      ],
    },
    {
      id: 'web-paas',
      universe: webCloudUniverse.id,
      translation: 'sidebar_web_paas',
      children: [
        {
          id: 'platform-sh',
          universe: webCloudUniverse.id,
          translation: 'sidebar_platform_sh',
          serviceType: 'WEBPAAS_SUBSCRIPTION',
          routing: {
            application: 'web',
            hash: '#/paas/webpaas/projects',
          },
          features: ['web-paas'],
        },
      ],
      features: ['web-paas'],
    },
    {
      id: 'emails',
      universe: webCloudUniverse.id,
      translation: 'sidebar_emails',
      features: ['email-pro', 'emails:mxplan'],
      children: [
        {
          id: 'email-pro',
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
      universe: webCloudUniverse.id,
      translation: 'sidebar_microsoft',
      features: ['office', 'exchange'],
      children: [
        {
          id: 'office',
          universe: webCloudUniverse.id,
          translation: 'sidebar_license_office',
          serviceType: 'LICENSE_OFFICE',
          routing: {
            application: 'web',
            hash: '#/office/license',
          },
          features: ['office'],
        },
        {
          id: 'exchange',
          universe: webCloudUniverse.id,
          translation: 'sidebar_exchange',
          serviceType: 'EMAIL_EXCHANGE_SERVICE',
          routing: {
            application: 'web',
            hash: '#/exchange',
          },
          features: ['exchange'],
        },
        {
          id: 'sharepoint',
          universe: webCloudUniverse.id,
          translation: 'sidebar_sharepoint',
          serviceType: 'MSSERVICES_SHAREPOINT',
          routing: {
            application: 'web',
            hash: '#/sharepoint',
          },
          features: ['sharepoint'],
        },
      ],
    },
  ];

export default webCloudUniverse;
