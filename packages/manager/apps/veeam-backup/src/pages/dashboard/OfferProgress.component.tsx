import { Fragment, useMemo } from 'react';
import {
  OdsIcon,
  OdsProgressBar,
  OdsText,
  OdsTooltip,
  OdsSkeleton,
  OdsBadge,
} from '@ovhcloud/ods-components/react';
import { AxiosError } from 'axios';
import { VeeamBackupOffer } from '@ovh-ux/manager-module-vcd-api';
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
        <OdsSkeleton />
        <OdsSkeleton />
      </Fragment>
    );
  }
  if (isError && (error as AxiosError)?.response?.status !== 404) {
    return (
      <OdsBadge
        color="critical"
        data-testid="error-api"
        label={t('error_api')}
      ></OdsBadge>
    );
  }

  const tooltipName = `${name}_tooltip`;
  const tooltipTrigger = `${tooltipName}_trigger`;

  return (
    <div className="flex flex-col">
      <div className="flex mb-3">
        <OdsText>
          {t('space_summary', { usedSpaceInGB, quotaInTB, percent })}
          <OdsIcon
            id={tooltipTrigger}
            className="ml-4"
            name="circle-question"
          />
          <OdsTooltip triggerId={tooltipTrigger}>
            <OdsText>{t(tooltipName)}</OdsText>
          </OdsTooltip>
        </OdsText>
      </div>
      <OdsProgressBar max={quotaInTB * 1000} value={usedSpaceInGB} />
      <div className="inline-flex flex-col w-max items-stretch space-y-1 mt-4">
        {protectionPrimaryRegion && (
          <div>
            <OdsText className=" mr-3">
              <span className="text-sm font-semibold">
                {t('storage_primary')}:
              </span>
            </OdsText>
            <OdsBadge
              color="information"
              size="sm"
              data-testid="primary-region"
              label={protectionPrimaryRegion}
            ></OdsBadge>
          </div>
        )}
        {protectionReplicatedRegion && (
          <div>
            <OdsText className="mr-3">
              <span className="text-sm font-semibold">
                {t('storage_secondary')}:
              </span>
            </OdsText>
            <OdsBadge
              color="information"
              size="sm"
              data-testid="secondary-region"
              label={protectionReplicatedRegion}
            ></OdsBadge>
          </div>
        )}
      </div>
    </div>
  );
};
