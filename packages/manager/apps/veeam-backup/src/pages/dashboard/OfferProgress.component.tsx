import { Fragment, useMemo } from 'react';
import {
  OsdsIcon,
  OsdsProgressBar,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
  OsdsSkeleton,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import { AxiosError } from 'axios';

import { VeeamBackupOffer } from '@ovh-ux/manager-module-vcd-api';

import { Description } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_SKELETON_SIZE,
  ODS_CHIP_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

import useVeeamBackupConsumption from '@/data/hooks/useVeeamBackupConsumption';

import { getConsumption } from './helpers';

export const OfferProgress = ({
  offer,
  id,
}: {
  offer: VeeamBackupOffer;
  id: string;
}): JSX.Element => {
  const { t } = useTranslation('dashboard');

  const {
    data: consumptions,
    isLoading,
    isError,
    error,
  } = useVeeamBackupConsumption(id);

  const {
    usedSpaceInGB,
    quotaInTB,
    percent,
    name,
    protectionPrimaryRegion,
    protectionReplicatedRegion,
  } = useMemo(() => {
    const realConsumption = getConsumption(offer.name, consumptions);
    return {
      ...offer,
      usedSpaceInGB: realConsumption,
      percent: (realConsumption / (offer.quotaInTB * 10)).toFixed(2),
    } as VeeamBackupOffer & { percent: string };
  }, [consumptions, offer]);

  if (isLoading) {
    return (
      <Fragment>
        <OsdsSkeleton inline size={ODS_SKELETON_SIZE.sm} />
        <OsdsSkeleton size={ODS_SKELETON_SIZE.md} />
      </Fragment>
    );
  }
  if (isError && (error as AxiosError)?.response?.status !== 404) {
    return (
      <OsdsChip color={ODS_THEME_COLOR_INTENT.error} inline>
        {t('error_api')}
      </OsdsChip>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex mb-3">
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('space_summary', { usedSpaceInGB, quotaInTB, percent })}
        </OsdsText>

        <OsdsTooltip>
          <OsdsIcon
            className="ml-4"
            name={ODS_ICON_NAME.HELP_CIRCLE}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_ICON_SIZE.xs}
          />
          <OsdsTooltipContent slot="tooltip-content">
            <Description>{t(`${name}_tooltip`)}</Description>
          </OsdsTooltipContent>
        </OsdsTooltip>
      </div>
      <OsdsProgressBar max={quotaInTB * 1000} value={usedSpaceInGB} />
      <div className="inline-flex flex-col w-max items-stretch space-y-4 mt-4">
        {protectionPrimaryRegion && (
          <OsdsChip
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_CHIP_SIZE.sm}
          >
            <span className="font-semibold mr-3">{t('storage_primary')}:</span>
            <span>{protectionPrimaryRegion}</span>
          </OsdsChip>
        )}
        {protectionReplicatedRegion && (
          <OsdsChip
            color={ODS_THEME_COLOR_INTENT.primary}
            inline
            size={ODS_CHIP_SIZE.sm}
          >
            <span className="font-semibold mr-3">
              {t('storage_secondary')}:
            </span>
            <span>{protectionReplicatedRegion}</span>
          </OsdsChip>
        )}
      </div>
    </div>
  );
};
