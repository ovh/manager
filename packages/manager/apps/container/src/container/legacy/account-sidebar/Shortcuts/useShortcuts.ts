import { Environment } from '@ovh-ux/manager-config';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useShell } from '@/context';

import { Shortcut } from './Tile/shortcut';

import getOdsIcon from '../getOdsIcon';

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
      {
        id: 'services',
        icon: getOdsIcon(ODS_ICON_NAME.MULTI_DEVICE_CONCEPT),
        url: navigation.getURL('billing', '#/autoRenew'),
        tracking: 'hub::sidebar::shortcuts::go-to-services',
      },
      {
        id: 'bills',
        icon: getOdsIcon(ODS_ICON_NAME.RECEIPT_CONCEPT),
        url: user.enterprise
          ? 'https://billing.us.ovhcloud.com/login'
          : navigation.getURL('dedicated', '#/billing/history'),
        tracking: 'hub::sidebar::shortcuts::go-to-bills',
      },
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'supportLevel',
              icon: getOdsIcon(ODS_ICON_NAME.LIFEBUOY_CONCEPT),
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
              icon: getOdsIcon(ODS_ICON_NAME.BOOK_OPEN_CONCEPT),
              tracking: 'hub::sidebar::shortcuts::go-to-catalog',
              url: navigation.getURL('catalog', '#/'),
            },
          ]),
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'emails',
              icon: getOdsIcon(ODS_ICON_NAME.ENVELOP_LETTER_CONCEPT),
              url: navigation.getURL('dedicated', '#/useraccount/emails'),
              tracking: 'hub::sidebar::shortcuts::go-to-emails',
            },
          ]
        : []),
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'contacts',
              icon: getOdsIcon(ODS_ICON_NAME.BOOK_CONTACT_CONCEPT),
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
