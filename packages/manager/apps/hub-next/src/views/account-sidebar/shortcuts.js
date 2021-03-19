import { buildURL } from '@ovh-ux/ufrontend/url-builder';

const shortcuts = (user, region) => [
  ...(['EU', 'CA'].includes(region)
    ? [
        {
          id: 'services',
          icon: 'oui-icon-multi-device_concept',
          url: buildURL('dedicated', '#/billing/autoRenew'),
        },
      ]
    : []),
  {
    id: 'bills',
    icon: 'oui-icon-receipt_concept',
    url: user?.isEnterprise
      ? 'https://billing.us.ovhcloud.com/login'
      : buildURL('dedicated', '#/billing/history'),
  },
  ...(['EU', 'CA'].includes(region)
    ? [
        {
          id: 'supportLevel',
          icon: 'oui-icon-lifebuoy_concept',
          url: buildURL('dedicated', '#/useraccount/support/level'),
        },
      ]
    : []),
  {
    id: 'products',
    icon: 'oui-icon-book-open_concept',
    url: buildURL('hub', '#/catalog'),
  },
  ...(['EU', 'CA'].includes(region)
    ? [
        {
          id: 'emails',
          icon: 'oui-icon-envelop-letter_concept',
          url: buildURL('dedicated', '#/useraccount/emails'),
        },
      ]
    : []),
  ...(region === 'EU'
    ? [
        {
          id: 'contacts',
          icon: 'oui-icon-book-contact_concept',
          url: buildURL('dedicated', '#/contacts/services'),
        },
      ]
    : []),
];

export default shortcuts;
