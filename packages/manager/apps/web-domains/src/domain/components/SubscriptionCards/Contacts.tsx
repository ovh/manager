import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Text } from '@ovhcloud/ods-react';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { TDomainResource } from '@/domain/types/domainResource';
import { contactsMapping } from '@/domain/constants/susbcriptions';
import { TDomainContact } from '@/common/types/common.types';

interface ContactsProps {
  readonly serviceName: string;
  readonly domainResource: TDomainResource;
  readonly domainContact: TDomainContact;
  readonly isFetchingDomainContact: boolean;
}

export default function Contacts({
  domainResource,
  serviceName,
  domainContact,
  isFetchingDomainContact,
}: ContactsProps) {
  const { t } = useTranslation(['domain', NAMESPACES.CONTACT]);

  const contacts = domainResource?.currentState.contactsConfiguration;

  const { data: reassignContactUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services',
    {
      serviceName,
      category: 'DOMAIN',
      service: serviceName,
      categoryType: 'DOMAIN',
    },
  ]);

  const renderContactsList = () => {
    return Object.entries(contacts).map(([contactType, contactDetail]) => {
      if (!domainContact) {
        return <></>;
      }

      if (!isFetchingDomainContact && contactType === 'contactOwner') {
        const { firstName, lastName, organisationName } = domainContact;
        const displayName = [firstName, lastName, organisationName]
          .filter(Boolean)
          .join(' ');
        return (
          <Text
            key={`${contactDetail.id}-${contactType}`}
          >{`${displayName}: ${t(contactsMapping[contactType])}`}</Text>
        );
      }

      return (
        <Text key={`${contactDetail.id}-${contactType}`}>{`${
          contactDetail.id
        }: ${t(contactsMapping[contactType])}`}</Text>
      );
    });
  };

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t(`${NAMESPACES.CONTACT}:contacts`)}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <div>{renderContactsList()}</div>
        <ActionMenu
          id="contacts"
          isCompact
          items={[
            {
              id: 1,
              label: t(
                'domain_tab_general_information_subscription_handle_contacts',
              ),
              href: reassignContactUrl as string,
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
