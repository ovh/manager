import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  Badge,
  BADGE_COLOR,
  Icon,
  ICON_NAME,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import {
  DOMAIN_STATUS,
  SUSPENSION_STATUS,
} from '@/domain/constants/serviceDetail';

interface GeneralInformationsCardsProps {
  readonly serviceName: string;
}

export default function GeneralInformationsCards({
  serviceName,
}: GeneralInformationsCardsProps) {
  const { t } = useTranslation(['domain']);
  const { domainResource } = useGetDomainResource(serviceName);

  const domainState = domainStatusToBadge(
    DOMAIN_STATUS,
    domainResource.currentState.mainState,
  );

  const techState = domainStatusToBadge(
    SUSPENSION_STATUS,
    domainResource.currentState.suspensionState,
  );

  if (!domainState || !techState) {
    return <></>;
  }

  return (
    <ManagerTile data-testid={'manager-tile'}>
      <ManagerTile.Title>
        {t('domain_tab_general_information_tile_title')}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain_tab_general_information_tile_title_domain_state')}
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
            </TooltipTrigger>
            <TooltipContent>
              {t('domain_tab_general_information_tooltip_domain_state')}
            </TooltipContent>
          </Tooltip>
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <Badge color={domainState.statusColor} className="mt-4">
            {t(`${domainState.i18nKey}`)}
          </Badge>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain_tab_general_information_tile_title_tech_state')}
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
            </TooltipTrigger>
            <TooltipContent>
              {t('domain_tab_general_information_tooltip_domain_tech_state')}
            </TooltipContent>
          </Tooltip>
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <Badge color={techState.statusColor} className="mt-4">
            {t(`${techState.i18nKey}`)}
          </Badge>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
