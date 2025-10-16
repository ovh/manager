import {
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
  Icon,
  Radio,
  RadioControl,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { TableRow } from '@/components/flavorsTable/FlavorsTable.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TFlavorDataForTable } from '@/pages/instances/create/view-models/flavorsViewModel';

export function FlavorRowsBuilder(
  flavors: TFlavorDataForTable[],
  withUnavailable: boolean,
): TableRow[] {
  const { t } = useTranslation('creation');

  return flavors
    .filter(
      ({ unavailable, unavailableQuota }) =>
        withUnavailable || !(unavailable || unavailableQuota),
    )
    .map((flavor) => {
      const isUnavailable = flavor.unavailable || flavor.unavailableQuota;

      const nameContent = (
        <div className="flex flex-row gap-4 w-full h-full flex-wrap items-center content-start">
          <Text preset={TEXT_PRESET.span} className="font-normal">
            {flavor.name}
          </Text>
          {isUnavailable && (
            <Badge
              size={BADGE_SIZE.sm}
              color={BADGE_COLOR.warning}
              className="h-fit text-wrap font-normal"
            >
              {flavor.unavailable
                ? t('pci_instance_creation_flavor_unavailable')
                : t('pci_instance_creation_flavor_unavailable_quota')}
              <Icon aria-label="Info" name="circle-info" role="img" />
            </Badge>
          )}
        </div>
      );

      return {
        id: flavor.name,
        disabled: flavor.unavailableQuota,
        action: (
          <Radio
            value={flavor.name}
            className="w-full"
            disabled={flavor.unavailableQuota}
          >
            <RadioControl />
          </Radio>
        ),
        name: isUnavailable ? (
          <Tooltip>
            <TooltipTrigger asChild className="px-2 py-4">
              {nameContent}
            </TooltipTrigger>
            <TooltipContent withArrow className="px-6 max-w-[250px]">
              <Text preset={TEXT_PRESET.caption}>
                {flavor.unavailable
                  ? t('pci_instance_creation_flavor_unavailable_help')
                  : t('pci_instance_creation_flavor_unavailable_quota_help')}
              </Text>
            </TooltipContent>
          </Tooltip>
        ) : (
          nameContent
        ),
        memory: <Text preset={TEXT_PRESET.span}>{flavor.memory}</Text>,
        vCore: <Text preset={TEXT_PRESET.span}>{flavor.vCore}</Text>,
        storage: <Text preset={TEXT_PRESET.span}>{flavor.storage}</Text>,
        mode: <DeploymentModeBadge mode={flavor.mode} size={BADGE_SIZE.sm} />,
        hourlyPrice: (
          <Text preset={TEXT_PRESET.span} className="font-semibold">
            {flavor.hourlyPrice.toFixed(4)} €
          </Text>
        ),
        monthlyPrice: (
          <Text preset={TEXT_PRESET.span} className="font-semibold">
            {flavor.monthlyPrice.toFixed(2)} € *
          </Text>
        ),
      };
    });
}
