import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Skeleton, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn, useBytes, useFormatDate } from '@ovh-ux/muk';

import { BillingStateBadge } from '@/components';
import { SlotService, ZimbraOffer, getOfferDefaultQuota } from '@/data/api';
import { SlotWithService, useSlotsWithService } from '@/data/hooks';
import { useOverridePage } from '@/hooks';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';

import { DatagridTopbar } from '../DatagridTopBar.component';
import { ActionButtonSlot } from './ActionButton.component';

export const SlotsDatagrid = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const isOverridedPage = useOverridePage();
  const { formatBytes } = useBytes();
  const format = useFormatDate();

  const {
    slots: items,
    fetchAllPages,
    fetchNextPage,
    hasNextPage,
    isLoadingSlots,
    isFetchingNextPage,
  } = useSlotsWithService({
    used: 'false',
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  const columns: DatagridColumn<SlotWithService>[] = useMemo(
    () => [
      {
        id: 'offer',
        accessorKey: 'offer',
        header: t('zimbra_account_datagrid_offer_label'),
      },
      {
        id: 'quota',
        accessorKey: 'offer',
        cell: ({ getValue }) => {
          return (
            <Text preset={TEXT_PRESET.paragraph}>
              {formatBytes(getOfferDefaultQuota(getValue<keyof typeof ZimbraOffer>()), 0, 1024)}
            </Text>
          );
        },
        header: t('zimbra_account_datagrid_quota'),
      },
      {
        id: 'renewal_date',
        accessorKey: 'service',
        cell: ({ row }) => {
          if (!row.original.service) {
            return <Skeleton className="[&::part(skeleton)]:max-w-20" />;
          }
          return (
            <span>{format({ date: row.original.service?.nextBillingDate, format: 'P' })}</span>
          );
        },
        header: t('zimbra_account_datagrid_renewal_date'),
      },
      {
        id: 'renewal_type',
        accessorKey: 'service',
        cell: ({ getValue }) => <BillingStateBadge service={getValue<SlotService>()} />,
        header: t('zimbra_account_datagrid_renewal_type'),
      },
      {
        id: 'tooltip',
        maxSize: 50,
        cell: ({ row }) => <ActionButtonSlot item={row.original} />,
        header: '',
      },
    ],
    [format, formatBytes, t],
  );

  return (
    <Datagrid
      topbar={<DatagridTopbar />}
      columns={columns}
      data={items}
      totalCount={items.length}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      onFetchAllPages={fetchAllPages}
      isLoading={isLoadingSlots || isFetchingNextPage}
    />
  );
};

export default SlotsDatagrid;
