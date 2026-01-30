import React, { useContext, useMemo, useState } from 'react';

import { RowSelectionState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Skeleton } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Clipboard,
  Datagrid,
  DatagridColumn,
  IntervalUnit,
  OvhSubsidiary,
  Price,
  useFormatDate,
} from '@ovh-ux/muk';

import { BillingStateBadge, LabelChip } from '@/components';
import { SlotService } from '@/data/api';
import { SlotWithService, useAccounts, useSlotsWithService } from '@/data/hooks';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { getPriceUnit } from '@/utils/price';

const Services = () => {
  const { t } = useTranslation(['services', 'common', 'accounts']);
  const format = useFormatDate();
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { ovhSubsidiary } = environment.getUser();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: DatagridColumn<SlotWithService>[] = useMemo(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        label: 'zimbra_services_service_reference',
        disabled: true,
        cell: ({ getValue }) => <Clipboard value={getValue<string>()} />,
      },
      {
        id: 'email',
        accessorKey: 'email',
        label: 'common:email_account',
      },
      {
        id: 'organization',
        accessorKey: 'organizationLabel',
        label: 'common:organization',
        cell: ({ row }) => {
          const { organizationId, organizationLabel } = row.original;
          return organizationId ? (
            <LabelChip id={organizationId}>{organizationLabel}</LabelChip>
          ) : (
            '-'
          );
        },
      },
      {
        id: 'offer',
        accessorKey: 'offer',
        label: 'common:offer',
      },
      {
        id: 'cost',
        accessorKey: 'cost',
        label: 'zimbra_services_cost',
        cell: ({ row }) => {
          const { priceInUcents, duration } = row.original.service;
          return priceInUcents === 0 ? (
            t('zimbra_services_free')
          ) : (
            <Price
              value={priceInUcents}
              locale={locale}
              ovhSubsidiary={ovhSubsidiary as OvhSubsidiary}
              intervalUnit={getPriceUnit(duration)}
            />
          );
        },
      },
      {
        id: 'renewal_type',
        accessorKey: 'service',
        label: 'accounts:zimbra_account_datagrid_renewal_type',
        cell: ({ getValue }) => <BillingStateBadge service={getValue<SlotService>()} />,
      },
      {
        id: 'renewal_date',
        accessorKey: 'service',
        label: 'zimbra_services_renew_date',
        cell: ({ row }) =>
          !row.original.service ? (
            <Skeleton className="[&::part(skeleton)]:max-w-20" />
          ) : (
            <span>
              {format({
                date: row.original.service?.nextBillingDate,
                format: 'P',
              })}
            </span>
          ),
      },
    ],
    [format, t, locale, ovhSubsidiary],
  );
  const { data: accounts } = useAccounts({ shouldFetchAll: true });
  const { slots, fetchAllPages, fetchNextPage, hasNextPage, isLoadingSlots, isFetchingNextPage } =
    useSlotsWithService({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    });

  const data = useMemo(() => {
    return slots.map((slot) => {
      const account = accounts?.find((acc) => acc.id === slot.accountId);

      return {
        id: slot.id,
        email: slot.email ?? '-',
        organizationLabel: account?.currentState.organizationLabel,
        organizationId: account?.currentState.organizationId,
        offer: slot.offer,
        service: slot.service,
        cost: slot.service?.price,
      };
    });
  }, [slots, accounts]);

  return (
    <div>
      <Datagrid
        rowSelection={{
          rowSelection,
          setRowSelection,
          enableRowSelection: () => true,
        }}
        columns={columns.map((column) => ({
          ...column,
          header: t(column.label),
        }))}
        data={data}
        totalCount={data.length}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
        isLoading={isLoadingSlots || isFetchingNextPage}
      />
    </div>
  );
};

export default Services;
