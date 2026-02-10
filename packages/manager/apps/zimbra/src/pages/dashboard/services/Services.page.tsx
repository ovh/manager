import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { RowSelectionState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import { Skeleton } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Clipboard,
  Datagrid,
  DatagridColumn,
  OvhSubsidiary,
  Price,
  useFormatDate,
} from '@ovh-ux/muk';

import { BillingStateBadge, LabelChip } from '@/components';
import { ResourceStatus, SlotService } from '@/data/api';
import { SlotWithService, useAccounts, useSlotsWithService } from '@/data/hooks';
import { useDebouncedValue } from '@/hooks';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { getPriceUnit } from '@/utils/price';

import ActionButtonService from './ActionButton.component';
import DatagridTopbar from './DatagridTopBar.component';

const Services = () => {
  const { t } = useTranslation(['services', 'common', 'accounts']);
  const format = useFormatDate();
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { ovhSubsidiary } = environment.getUser();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedRows, setSelectedRows] = useState<SlotWithService[]>([]);

  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');

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
        isSearchable: true,
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
          const service = row.original.service;

          if (!service) {
            return <Skeleton className="[&::part(skeleton)]:max-w-20" />;
          }

          const { priceInUcents, duration } = service;

          return priceInUcents === 0 ? (
            t('services:zimbra_services_free')
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
      {
        id: 'tooltip',
        maxSize: 50,
        accessorFn: (row) => row.id,
        cell: ({ row }) => <ActionButtonService item={row.original} />,
      },
    ],
    [format, t, locale, ovhSubsidiary],
  );
  const { data: accounts } = useAccounts({ shouldFetchAll: true });
  const { slots, fetchAllPages, fetchNextPage, hasNextPage, isLoadingSlots, isFetchingNextPage } =
    useSlotsWithService({
      email: debouncedSearchInput,
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
        status: account?.resourceStatus,
        accountId: account?.id,
      };
    });
  }, [slots, accounts]);

  useEffect(() => {
    setSelectedRows(data?.filter((item) => rowSelection[item.id]));
  }, [data, rowSelection]);

  const isRowSelectable = useCallback(
    (item: SlotWithService) => item.status === ResourceStatus.READY,
    [],
  );

  return (
    <div>
      <Outlet />
      <Datagrid
        topbar={<DatagridTopbar selectedRows={selectedRows} />}
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
        rowSelection={{
          rowSelection,
          setRowSelection,
          enableRowSelection: ({ original: item }) => isRowSelectable(item),
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
