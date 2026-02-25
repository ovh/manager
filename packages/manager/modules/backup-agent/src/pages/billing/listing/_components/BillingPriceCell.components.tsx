import React from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { consumptionQueries } from '@/data/queries/consumption.queries';
import { VAULT_PLAN_CODE } from '@/module.constants';

export type BillingPriceCellProps = { vaultId: string };

export const BillingPriceCell = ({ vaultId }: BillingPriceCellProps) => {
  const queryClient = useQueryClient();
  const { data: priceText, isPending } = useQuery({
    ...consumptionQueries.withClient(queryClient).byResource(vaultId),
    select: (consumptions) =>
      consumptions?.find((consumption) => consumption.planCode === VAULT_PLAN_CODE)?.price.text,
  });

  if (isPending) {
    return <OdsSkeleton className="w-10" />;
  }

  return <DataGridTextCell>{priceText ?? '-'}</DataGridTextCell>;
};
