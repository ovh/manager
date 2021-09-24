import { buildURL } from '@ovh-ux/ufrontend/url-builder';

const useShortcuts = (environment) => {
  const region = environment.getRegion();
  const user = environment.getUser();

  const getShortcuts = () => {
    return [
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'services',
              icon: 'oui-icon-multi-device_concept',
              url: buildURL('dedicated', '#/billing/autoRenew'),
              tracking: 'hub::sidebar::shortcuts::go-to-services',
            },
          ]
        : []),
      {
        id: 'bills',
        icon: 'oui-icon-receipt_concept',
        url: user.enterprise
          ? 'https://billing.us.ovhcloud.com/login'
          : buildURL('dedicated', '#/billing/history'),
        tracking: 'hub::sidebar::shortcuts::go-to-bills',
      },
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'supportLevel',
              icon: 'oui-icon-lifebuoy_concept',
              url: buildURL('dedicated', '#/useraccount/support/level'),
              tracking: 'hub::sidebar::shortcuts::go-to-support-level',
            },
          ]
        : []),
      ...(user.isTrusted
        ? []
        : [
            {
              id: 'products',
              icon: 'oui-icon-book-open_concept',
              tracking: 'hub::sidebar::shortcuts::go-to-catalog',
              url: buildURL('hub', '#/catalog'),
            },
          ]),
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'emails',
              icon: 'oui-icon-envelop-letter_concept',
              url: buildURL('dedicated', '#/useraccount/emails'),
              tracking: 'hub::sidebar::shortcuts::go-to-emails',
            },
          ]
        : []),
      ...(['EU'].includes(region)
        ? [
            {
              id: 'contacts',
              icon: 'oui-icon-book-contact_concept',
              url: buildURL('dedicated', '#/contacts/services'),
              tracking: 'hub::sidebar::shortcuts::go-to-contacts',
            },
          ]
        : []),
    ];
  };

  return {
    getShortcuts,
  };
};

export default useShortcuts;
