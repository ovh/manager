import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Text } from '@ovhcloud/ods-react';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { TDomainResource } from '@/domain/types/domainResource';
import { contactsMapping } from '@/domain/constants/susbcriptions';
import { TDomainContact } from '@/common/types/common.types';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { useNavigate } from 'react-router-dom';
import { Universe } from '@/common/enum/common.enum';

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
  const navigate = useNavigate();
  const { t } = useTranslation(['domain', NAMESPACES.CONTACT]);
  const contacts = domainResource?.currentState.contactsConfiguration;

  const { nichandleInformation } = useNichandleInformation();
  const account = nichandleInformation?.auth?.account;
  const id =
    domainResource?.currentState?.contactsConfiguration?.contactAdministrator
      ?.id;

  const { data: reassignContactUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services',
    {
      serviceName,
      category: Universe.DOMAIN,
      service: serviceName,
      categoryType: Universe.DOMAIN,
    },
  ]);

  let ownerId = '';

  const domainDetailUrl = useGenerateUrl(
    urls.domainTabContactManagementEdit,
    'path',
    {
      serviceName,
      holderId: String(
        domainResource?.currentState?.contactsConfiguration?.contactOwner?.id ??
          '',
      ),
    },
  );

  const renderContactsList = () => {
    return Object.entries(contacts)
      .map(([contactType, contactDetail]) => {
        if (contactType === 'contactOwner') {
          if (isFetchingDomainContact || !domainContact) {
            return null;
          }

          ownerId = contactDetail.id;

          const { firstName, lastName, organisationName } = domainContact;
          const displayName = [firstName, lastName, organisationName]
            .filter(Boolean)
            .join(' ');
          return (
            <Text key={`${ownerId}-${contactType}`}>{`${displayName}: ${t(
              contactsMapping[contactType],
            )}`}</Text>
          );
        }

        return (
          <Text key={`${contactDetail.id}-${contactType}`}>{`${
            contactDetail.id
          }: ${t(contactsMapping[contactType])}`}</Text>
        );
      })
      .filter(Boolean);
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
            {
              id: 2,
              label: t(
                'domain_tab_general_information_subscription_edit_owner',
              ),
              onClick: () => {
                navigate(domainDetailUrl);
              },
              isDisabled: id !== account,
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
