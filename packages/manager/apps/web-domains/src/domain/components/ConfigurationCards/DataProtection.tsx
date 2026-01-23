import { ConfigurationDataProtectionBadgeColorAndContent } from '@/domain/constants/configuration.card';
import {
  TContactDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { Badge, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { dataProtectionStatus } from '@/domain/utils/dataProtection';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

interface DataProtectionProps {
  readonly domainResource: TDomainResource;
  readonly setDataProtectionDrawerOpened: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function DataProtection({
  domainResource,
  setDataProtectionDrawerOpened,
}: DataProtectionProps) {
  const { t } = useTranslation(['domain', NAMESPACES.IAM]);

  const status = dataProtectionStatus(domainResource);
  const statusDetails = ConfigurationDataProtectionBadgeColorAndContent[status];

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_data_protection')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {Object.values(domainResource.currentState?.contactsConfiguration).some(
          (contact: TContactDetails) =>
            contact.disclosurePolicy?.forcedDisclosureConfiguration,
        ) ? (
          <Text>
            {t('domain_tab_general_information_data_protection_disabled')}
          </Text>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Badge color={statusDetails.color}>
                {t(statusDetails.i18nkeyContent)}
              </Badge>
              <ActionMenu
                id={'data-protection-action-menu'}
                isCompact
                items={[
                  {
                    id: 1,
                    label: t(
                      'domain_tab_general_information_data_protection_manage_button',
                    ),
                    isDisabled: Object.values(
                      domainResource?.currentState?.contactsConfiguration,
                    ).every(
                      (contact: TContactDetails) =>
                        !contact?.disclosurePolicy?.visibleViaRdds ||
                        contact?.disclosurePolicy
                          ?.forcedDisclosureConfiguration,
                    ),
                    onClick: () => setDataProtectionDrawerOpened(true),
                    iamActions: ['domain:apiovh:name/edit'],
                    urn: domainResource?.iam?.urn || '',
                  },
                ]}
              />
            </div>
            <Text>{t(statusDetails.i18nkeySubContent)}</Text>
          </>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
}
