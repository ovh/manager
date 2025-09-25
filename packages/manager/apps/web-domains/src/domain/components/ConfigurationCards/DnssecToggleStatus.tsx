import React from 'react';
import {
  ManagerTile,
  useAuthorizationIam,
} from '@ovh-ux/manager-react-components';
import {
  Badge,
  Icon,
  ICON_NAME,
  Skeleton,
  Toggle,
  ToggleControl,
  ToggleLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ConfigurationDnssecBadgeColorAndContent } from '@/domain/constants/configuration.card';
import { DnssecStatus } from '@/domain/types/domainZone';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import { TDomainResource } from '@/domain/types/domainResource';

interface DnssecToggleStatusProps {
  readonly dnssecStatus: DnssecStatus;
  readonly isDnssecStatusLoading: boolean;
  readonly domainResource: TDomainResource;
  readonly dnssecModalOpened: boolean;
  readonly setDnssecModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DnssecToggleStatus({
  dnssecStatus,
  isDnssecStatusLoading,
  domainResource,
  dnssecModalOpened,
  setDnssecModalOpened,
}: DnssecToggleStatusProps) {
  const { t } = useTranslation(['domain', NAMESPACES.IAM, NAMESPACES.STATUS]);
  const { isPending, isAuthorized } = useAuthorizationIam(
    ['dnsZone:apiovh:dnssec/create', 'dnsZone:apiovh:dnssec/delete'],
    `urn:v1:eu:resource:dnsZone:${domainResource.id}`,
  );

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_dnssec')}
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
          </TooltipTrigger>
          <TooltipContent>
            {t(
              ConfigurationDnssecBadgeColorAndContent[
                dnssecStatus?.status ?? DnssecStatusEnum.NOT_SUPPORTED
              ].i18nkeyTooltip,
            )}
          </TooltipContent>
        </Tooltip>
      </ManagerTile.Item.Label>
      {isDnssecStatusLoading ? (
        <Skeleton data-testid={'loading-skeleton'} />
      ) : (
        <ManagerTile.Item.Description>
          <Toggle
            withLabels={true}
            className="items-end"
            disabled={
              !domainResource.currentState.dnsConfiguration.dnssecSupported ||
              ConfigurationDnssecBadgeColorAndContent[
                dnssecStatus?.status ?? DnssecStatusEnum.NOT_SUPPORTED
              ].toggleStatus === 'disabled' ||
              !isAuthorized
            }
            checked={
              dnssecStatus?.status === DnssecStatusEnum.ENABLED ||
              dnssecStatus?.status === DnssecStatusEnum.ENABLE_IN_PROGRESS
            }
            onCheckedChange={() => setDnssecModalOpened(!dnssecModalOpened)}
            data-testid={'toggle'}
          >
            <Tooltip>
              <TooltipTrigger asChild disabled={!isAuthorized && !isPending}>
                <div className="flex items-end gap-4">
                  <ToggleControl data-testid={'toggle-control'} />
                  <ToggleLabel>
                    <Badge
                      color={
                        ConfigurationDnssecBadgeColorAndContent[
                          dnssecStatus?.status ?? DnssecStatusEnum.NOT_SUPPORTED
                        ].color
                      }
                      className="mt-4"
                    >
                      {t(
                        ConfigurationDnssecBadgeColorAndContent[
                          dnssecStatus?.status ?? DnssecStatusEnum.NOT_SUPPORTED
                        ].i18nkeyContent,
                      )}
                    </Badge>
                  </ToggleLabel>
                </div>
              </TooltipTrigger>
              {!isAuthorized && !isPending && (
                <TooltipContent>
                  {t(`${NAMESPACES.IAM}:iam_actions_message`)}
                </TooltipContent>
              )}
            </Tooltip>
          </Toggle>
        </ManagerTile.Item.Description>
      )}
    </ManagerTile.Item>
  );
}
