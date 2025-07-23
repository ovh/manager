import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import {
  Datagrid,
  DatagridColumn,
  useBytes,
  useFormatDate,
} from '@ovh-ux/manager-react-components';

import { BillingStateBadge } from '@/components';
import { getOfferDefaultQuota } from '@/data/api';
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
        cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.offer}</OdsText>,
        label: 'zimbra_account_datagrid_offer_label',
      },
      {
        id: 'quota',
        cell: (item) => {
          return (
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {formatBytes(getOfferDefaultQuota(item.offer), 0, 1024)}
            </OdsText>
          );
        },
        label: 'zimbra_account_datagrid_quota',
      },
      {
        id: 'renewal_date',
        cell: (item) => {
          if (!item.service) {
            return <OdsSkeleton className="[&::part(skeleton)]:max-w-[5rem]" />;
          }
          return <span>{format({ date: item.service?.nextBillingDate, format: 'P' })}</span>;
        },
        label: 'zimbra_account_datagrid_renewal_date',
      },
      {
        id: 'renewal_type',
        cell: (item) => <BillingStateBadge state={item.service?.state} />,
        label: 'zimbra_account_datagrid_renewal_type',
      },
      {
        id: 'tooltip',
        cell: (item: SlotWithService) => <ActionButtonSlot item={item} />,
        label: '',
      },
    ],
    [format, formatBytes],
  );

  return (
    <Datagrid
      topbar={<DatagridTopbar />}
      columns={columns.map((column) => ({
        ...column,
        label: t(column.label),
      }))}
      items={items}
      totalItems={items.length}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      onFetchAllPages={fetchAllPages}
      isLoading={isLoadingSlots || isFetchingNextPage}
    />
  );
};

export default SlotsDatagrid;
