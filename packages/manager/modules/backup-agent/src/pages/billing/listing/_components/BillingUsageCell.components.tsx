import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { useGetServiceConsumptionOptions } from '@/data/hooks/consumption/useServiceConsumption';
import { VAULT_PLAN_CODE } from '@/module.constants';

export type BillingUsageCellProps = { vaultId: string };

export const BillingUsageCell = ({ vaultId }: BillingUsageCellProps) => {
  const { t } = useTranslation([NAMESPACES.BYTES]);
  const { data: consumptionQuantity, isPending } = useQuery({
    ...useGetServiceConsumptionOptions()(vaultId),
    select: (consumptions) =>
      consumptions.find((consumption) => consumption.planCode === VAULT_PLAN_CODE)?.quantity,
  });

  if (isPending) {
    return <OdsSkeleton />;
  }

  return (
    <DataGridTextCell>
      {consumptionQuantity ? `${consumptionQuantity} ${t('unit_size_GB')}` : '-'}
    </DataGridTextCell>
  );
};
