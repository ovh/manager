import { TServiceInfo } from '@/common/types/common.types';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface ContactsProps {
  contacts: TServiceInfo['customer']['contacts'];
}

export default function Contacts({ contacts }: ContactsProps) {
  const { t } = useTranslation([NAMESPACES.CONTACT, 'domain']);
  const { data: reassignContactUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services',
    {
      category: 'RESELLER',
    },
  ]);
  return (
    <ManagerTile.Item>
      <div className="flex items-center justify-between">
        <div>
          <ManagerTile.Item.Label>
            {t(`${NAMESPACES.CONTACT}:contacts`)}
          </ManagerTile.Item.Label>
          <ul className="list-none p-0 m-0">
            {contacts.map((contact) => (
              <li key={contact.type}>
                <Text>
                  {contact.customerCode}
                  <span>
                    :{' '}
                    {t(
                      `domain:domain_tab_general_information_subscription_contact_${contact.type}`,
                    )}
                  </span>
                </Text>
              </li>
            ))}
          </ul>
        </div>
        <ActionMenu
          id="contacts"
          isCompact
          items={[
            {
              id: 1,
              label: t(
                'domain:domain_tab_general_information_subscription_handle_contacts',
              ),
              href: reassignContactUrl as string,
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
