import React from 'react';
import {
  OsdsIcon,
  OsdsProgressBar,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { Description } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_SKELETON_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { VeeamBackupOffer } from '@ovh-ux/manager-module-vcd-api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useVeeamBackupConsumptionQueryOptions } from '@/data/hooks/useVeeamBackupConsumption';
import { VEEAM_BACKUP_CONSUMPTION_PLAN_CODE } from './Dashboard.constants';
import { TServiceConsumption } from '@/type/service-consumption.type';

export const getNumberVeeamBackupConsumption = (
  offerName: VeeamBackupOffer['name'],
  consumptions: Readonly<TServiceConsumption[]>,
) => {
  const consumption = consumptions?.find(
    ({ planCode }) =>
      planCode === VEEAM_BACKUP_CONSUMPTION_PLAN_CODE[offerName],
  );
  return { usedSpaceInGB: consumption?.quantity ?? 0 };
};

export const OfferProgress: React.FC<{
  id: string;
  offer: VeeamBackupOffer;
}> = ({ id, offer: { name, quotaInTB } }) => {
  const optionsOfVeeamBackupComsumption = useVeeamBackupConsumptionQueryOptions(
    id,
  );

  const {
    data,
    isLoading: isLoadingConsumption,
    isError: isErrorConsumption,
    error,
  } = useQuery({
    ...optionsOfVeeamBackupComsumption,
    select: (consumptions) =>
      getNumberVeeamBackupConsumption(name, consumptions.data),
  });

  const { t } = useTranslation('dashboard');
  const percent = (data?.usedSpaceInGB / (quotaInTB * 10)).toFixed(2);

  if (isErrorConsumption && (error as AxiosError)?.response?.status !== 404) {
    return (
      <OsdsText
        data-testid="offer-progress-error"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._500}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('error_loading_consumption')}
      </OsdsText>
    );
  }

  if (isLoadingConsumption) {
    return (
      <>
        <OsdsSkeleton
          data-testid="offer-progress-loading"
          inline
          size={ODS_SKELETON_SIZE.sm}
        />
        <OsdsSkeleton size={ODS_SKELETON_SIZE.md} />
      </>
    );
  }

  return (
    <div data-testid="offer-progress-progress-bar" className="flex flex-col">
      <div className="flex mb-3">
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('space_summary', {
            usedSpaceInGB: data?.usedSpaceInGB,
            quotaInTB,
            percent,
          })}
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
      <OsdsProgressBar max={quotaInTB * 1000} value={data?.usedSpaceInGB} />
    </div>
  );
};
