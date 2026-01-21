import { ConfigurationDataProtectionBadgeColorAndContent } from '@/domain/constants/configuration.card';
import {
  TContactDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import {
  ActionMenu,
  ManagerTile,
  useAuthorizationIam,
} from '@ovh-ux/manager-react-components';
import {
  Badge,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { dataProtectionStatus } from '@/domain/utils/dataProtection';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TServiceInfo } from '@/common/types/common.types';
import { isServiceInCreation } from '@/domain/utils/helpers';

interface DataProtectionProps {
  readonly domainResource: TDomainResource;
  readonly serviceInfo: TServiceInfo;
  readonly setDataProtectionDrawerOpened: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function DataProtection({
  domainResource,
  serviceInfo,
  setDataProtectionDrawerOpened,
}: DataProtectionProps) {
  const { t } = useTranslation(['domain', NAMESPACES.IAM]);

  const urn = domainResource?.iam?.urn;
  const { isPending, isAuthorized } = useAuthorizationIam(
    ['domain:apiovh:name/edit'],
    urn,
  );

  const status = dataProtectionStatus(domainResource);
  const statusDetails = ConfigurationDataProtectionBadgeColorAndContent[status];

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_data_protection')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex items-center justify-between">
          <Badge color={statusDetails.color}>
            {t(statusDetails.i18nkeyContent)}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ActionMenu
                  id={'data-protection-action-menu'}
                  isCompact
                  isDisabled={isServiceInCreation(serviceInfo)}
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
            </TooltipTrigger>
            {isServiceInCreation(serviceInfo) && (
              <TooltipContent>
                {t('domain_tab_name_service_in_creation')}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
        <Text>{t(statusDetails.i18nkeySubContent)}</Text>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
}
