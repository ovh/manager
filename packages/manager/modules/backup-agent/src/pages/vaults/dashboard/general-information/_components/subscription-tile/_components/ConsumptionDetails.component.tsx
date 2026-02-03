import { useId } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsProgressBar, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useGetServiceConsumptionOptions } from '@/data/hooks/consumption/useServiceConsumption';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { VAULT_PLAN_CODE } from '@/module.constants';

import { CONSUMPTION_MAX_VALUE_IN_TB } from '../SubscriptionTile.component';

export const ConsumptionDetails = () => {
  const idLabel = useId();
  const { t } = useTranslation([NAMESPACES.BYTES]);
  const { vaultId } = useRequiredParams('vaultId');
  const { data: consumptionData, isPending } = useQuery(useGetServiceConsumptionOptions()(vaultId));

  if (isPending) {
    return (
      <section className="flex flex-col gap-2 mb-2">
        <OdsSkeleton />
        <OdsSkeleton />
      </section>
    );
  }

  const consumptionInGB =
    consumptionData?.find((consumption) => consumption.planCode === VAULT_PLAN_CODE)?.quantity ?? 0;
  const consumptionInTB = consumptionInGB / 1000;
  const consumptionInPercentage = (consumptionInTB / CONSUMPTION_MAX_VALUE_IN_TB) * 100;
  const consumptionLabel = `${consumptionInGB} ${t('unit_size_GB')} / ${CONSUMPTION_MAX_VALUE_IN_TB} ${t('unit_size_TB')} (${consumptionInPercentage}%)`;

  return (
    <section className="flex flex-col gap-2">
      <OdsText id={idLabel}>{consumptionLabel}</OdsText>
      <OdsProgressBar value={consumptionInPercentage} className="[&::part(progress)]:w-full" />
    </section>
  );
};
