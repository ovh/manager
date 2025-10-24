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
import { ReactNode } from 'react';

export function useFlavorCommon() {
  const { t } = useTranslation('creation');

  const renderName = (flavor: {
    name: string;
    unavailable?: boolean;
    unavailableQuota?: boolean;
  }) => {
    const isUnavailable = flavor.unavailable || flavor.unavailableQuota;

    const nameContent = (
      <div className="flex flex-row gap-4 w-full h-full flex-wrap items-center content-start">
        <Text preset={TEXT_PRESET.span} className="font-normal text-nowrap">
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

    if (!isUnavailable) return nameContent;

    return (
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
    );
  };

  const renderRadio = (name: string, disabled?: boolean): ReactNode => (
    <Radio value={name} className="w-full" disabled={disabled}>
      <RadioControl />
    </Radio>
  );

  return { renderName, renderRadio };
}
