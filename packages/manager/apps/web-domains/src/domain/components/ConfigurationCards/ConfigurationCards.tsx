import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  Badge,
  BADGE_COLOR,
  FormField,
  Icon,
  ICON_NAME,
  Toggle,
  ToggleControl,
  ToggleLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ConfigurationCardsProps {
  readonly serviceName: string;
}

export default function ConfigurationCards({
  serviceName,
}: ConfigurationCardsProps) {
  const { t } = useTranslation(['domain']);

  return (
    <ManagerTile>
      <ManagerTile.Title>Configuration</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Serveur DNS</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <Badge color={BADGE_COLOR.success} className="mt-4">
            Enregistré
          </Badge>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          Délégation sécurisée - DNSSEC
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
          <Toggle withLabels={true} className="items-end">
            <ToggleControl />
            <ToggleLabel>
              <Badge color={BADGE_COLOR.success} className="mt-4">
                Enregistré
              </Badge>
            </ToggleLabel>
          </Toggle>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          Protection contre le transfert
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
          <Toggle withLabels={true} className="items-end">
            <ToggleControl />
            <ToggleLabel>
              <Badge color={BADGE_COLOR.success} className="mt-4">
                Enregistré
              </Badge>
            </ToggleLabel>
          </Toggle>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
