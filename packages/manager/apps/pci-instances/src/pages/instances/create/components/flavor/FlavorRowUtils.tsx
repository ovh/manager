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
import { Trans, useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { useCatalogPrice } from '@ovh-ux/muk';

export function useFlavorCommon() {
  const { t } = useTranslation(['creation', 'common']);
  const { getTextPrice } = useCatalogPrice(4);

  const renderName = (flavor: {
    name: string;
    unavailable?: boolean;
    unavailableQuota?: boolean;
    hasNoAvailableRegions?: boolean;
  }) => {
    const isUnavailable = flavor.unavailable || flavor.unavailableQuota;
    const isComingSoon = flavor.unavailable && flavor.hasNoAvailableRegions;

    const getBadgeLabel = () => {
      if (flavor.unavailableQuota)
        return t('pci_instance_creation_flavor_unavailable_quota');
      if (isComingSoon)
        return t('common:pci_instances_common_coming_soon');
      return t('pci_instance_creation_flavor_unavailable');
    };

    const nameContent = (
      <div className="flex size-full flex-row flex-wrap content-start items-center gap-4">
        <Text preset={TEXT_PRESET.span} className="text-nowrap font-normal">
          {flavor.name}
        </Text>
        {isUnavailable && (
          <Badge
            size={BADGE_SIZE.sm}
            color={BADGE_COLOR.warning}
            className="h-fit text-wrap font-normal"
          >
            {getBadgeLabel()}
            <Icon aria-label="Info" name="circle-info" role="img" />
          </Badge>
        )}
      </div>
    );

    if (!isUnavailable || isComingSoon) return nameContent;

    return (
      <Tooltip>
        <TooltipTrigger asChild className="px-2 py-4">
          {nameContent}
        </TooltipTrigger>
        <TooltipContent withArrow className="max-w-[250px] px-6">
          <Text preset={TEXT_PRESET.caption}>
            {flavor.unavailable ? (
              <Trans
                t={t}
                i18nKey="pci_instance_creation_flavor_unavailable_help"
                components={{ sb: <span className="font-semibold" /> }}
              />
            ) : (
              t('pci_instance_creation_flavor_unavailable_quota_help')
            )}
          </Text>
        </TooltipContent>
      </Tooltip>
    );
  };

  const renderRadio = (id: string, disabled?: boolean): ReactNode => (
    <Radio value={id} className="w-full" disabled={disabled}>
      <RadioControl />
    </Radio>
  );

  const renderHourlyPrice = (value: number | null) => {
    const minimumHourlyPrice = value !== null ? getTextPrice(value) : '-';
    return (
      <Text preset={TEXT_PRESET.span} className="font-semibold">
        {minimumHourlyPrice}
      </Text>
    );
  };

  const renderMonthlyPrice = (
    realMinimumMonthlyPrice: number | null,
    estimatedMinimumMonthlyPrice: number | null,
  ) => {
    const minimumMonthlyPrice =
      realMinimumMonthlyPrice !== null
        ? getTextPrice(realMinimumMonthlyPrice)
        : estimatedMinimumMonthlyPrice !== null
        ? `~ ${getTextPrice(estimatedMinimumMonthlyPrice)}`
        : '-';
    return (
      <Text preset={TEXT_PRESET.span} className="font-semibold">
        {minimumMonthlyPrice}
      </Text>
    );
  };

  return { renderName, renderRadio, renderHourlyPrice, renderMonthlyPrice };
}
