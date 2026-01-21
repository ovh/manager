import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Skeleton,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import {
  useNavigation,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { TDomainResource } from '@/domain/types/domainResource';
import { contactsMapping } from '@/domain/constants/susbcriptions';
import { TDomainContact, TServiceInfo } from '@/common/types/common.types';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import { Universe } from '@/common/enum/common.enum';
import { isServiceInCreation } from '@/domain/utils/helpers';

interface ContactsProps {
  readonly serviceName: string;
  readonly domainResource: TDomainResource;
  readonly serviceInfo: TServiceInfo;
  readonly domainContact: TDomainContact;
  readonly isFetchingDomainContact: boolean;
}

export default function Contacts({
  domainResource,
  serviceName,
  serviceInfo,
  domainContact,
  isFetchingDomainContact,
}: ContactsProps) {
  const { t } = useTranslation(['domain', NAMESPACES.CONTACT]);
  const contacts = domainResource?.currentState.contactsConfiguration;
  const { navigateTo } = useNavigation();

  const { nichandleInformation } = useNichandleInformation();
  const account = nichandleInformation?.auth?.account;
  const {
    id,
  } = domainResource?.currentState?.contactsConfiguration?.contactAdministrator;

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

  const renderContactsList = () => {
    return Object.entries(contacts)
      .map(([contactType, contactDetail]) => {
        if (contactType === 'contactOwner') {
          if (isFetchingDomainContact) {
            return <Skeleton key={contactType} />;
          }

          if (!domainContact) {
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
          <Text key={`${contactDetail.id}-${contactType}`}>{`${contactDetail.id
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
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionMenu
                id="contacts"
                isCompact
                isDisabled={isServiceInCreation(serviceInfo)}
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
                      navigateTo(
                        'web',
                        `#/domain/${serviceName}/contact-management/edit-contact/${ownerId}/`,
                        {},
                      );
                    },
                    isDisabled: id !== account,
                  },
                ]}
              />
            </div>
          </TooltipTrigger>
          {isServiceInCreation(serviceInfo) && (
            <TooltipContent>
              {t('domain_tab_name_service_in_creation')}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </ManagerTile.Item>
  );
}
