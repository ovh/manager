import { Environment } from '@ovh-ux/manager-config/types';
import { useShell } from '@/context';

import { Shortcut } from './Tile/shortcut';

interface UseShortcuts {
  getShortcuts(): Shortcut[];
}

const useShortcuts = (): UseShortcuts => {
  const shell = useShell();
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const region = environment.getRegion();
  const user = environment.getUser();
  const navigation = shell.getPlugin('navigation');

  const getShortcuts = (): Shortcut[] => {
    return [
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'services',
              icon: 'oui-icon-multi-device_concept',
              url: navigation.getURL('dedicated', '#/billing/autoRenew'),
              tracking: 'hub::sidebar::shortcuts::go-to-services',
            },
          ]
        : []),
      {
        id: 'bills',
        icon: 'oui-icon-receipt_concept',
        url: user.enterprise
          ? 'https://billing.us.ovhcloud.com/login'
          : navigation.getURL('dedicated', '#/billing/history'),
        tracking: 'hub::sidebar::shortcuts::go-to-bills',
      },
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'supportLevel',
              icon: 'oui-icon-lifebuoy_concept',
              url: navigation.getURL(
                'dedicated',
                '#/useraccount/support/level',
              ),
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
              url: navigation.getURL('hub', '#/catalog'),
            },
          ]),
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'emails',
              icon: 'oui-icon-envelop-letter_concept',
              url: navigation.getURL('dedicated', '#/useraccount/emails'),
              tracking: 'hub::sidebar::shortcuts::go-to-emails',
            },
          ]
        : []),
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'contacts',
              icon: 'oui-icon-book-contact_concept',
              url: navigation.getURL('dedicated', '#/contacts/services'),
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
