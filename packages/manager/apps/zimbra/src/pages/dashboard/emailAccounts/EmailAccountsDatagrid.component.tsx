import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn, useBytes } from '@ovh-ux/manager-react-components';

import { BadgeStatus, BillingStateBadge, LabelChip } from '@/components';
import { AccountType, ResourceStatus, getZimbraPlatformListQueryKey } from '@/data/api';
import { useAccounts, useSlotServices } from '@/data/hooks';
import { useDebouncedValue, useOverridePage } from '@/hooks';
import queryClient from '@/queryClient';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';

import { ActionButtonEmailAccount } from './ActionButton.component';
import { DatagridTopbar } from './DatagridTopBar.component';
import { EmailAccountItem } from './EmailAccounts.types';

export const EmailAccountsDatagrid = () => {
  const { t } = useTranslation(['accounts', 'common', NAMESPACES.STATUS]);
  const [hasADeletingAccount, setHasADeletingAccount] = useState(false);
  const isOverridedPage = useOverridePage();
  const { formatBytes } = useBytes();

  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');

  const {
    data: accounts,
    fetchAllPages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useAccounts({
    email: debouncedSearchInput,
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  const { data: services } = useSlotServices({
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
    enabled: !isOverridedPage,
  });

  /* This is necessary to enable back the "Create account" button when your
   * slots are full and you delete an account and the account goes
   * from "DELETING" state to actually being deleted, because we invalidate
   * the cache when sending the delete request of the account but when it is
   * in "DELETING" state the slot is not yet freed, to me it should be
   * but it requires changes on backend side */
  useEffect(() => {
    const current = accounts?.some((account) => account.resourceStatus === ResourceStatus.DELETING);
    if (hasADeletingAccount !== current) {
      if (!current) {
        queryClient.invalidateQueries({
          queryKey: getZimbraPlatformListQueryKey(),
        });
      }
      setHasADeletingAccount(current);
    }
  }, [accounts, hasADeletingAccount]);

  const items: EmailAccountItem[] = useMemo(() => {
    return (
      accounts?.map((item: AccountType) => ({
        id: item.id,
        email: item.currentState.email,
        offer: item.currentState.offer,
        organizationId: item.currentState.organizationId,
        organizationLabel: item.currentState.organizationLabel,
        used: item.currentState.quota.used,
        available: item.currentState.quota.available,
        status: item.resourceStatus,
        slotId: item.currentState.slotId,
        service: services?.[item.currentState.slotId],
      })) ?? []
    );
  }, [accounts, services]);

  const columns: DatagridColumn<EmailAccountItem>[] = useMemo(
    () => [
      {
        id: 'email_account',
        cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.email}</OdsText>,
        label: 'common:email_account',
        isSearchable: true,
      },
      {
        id: 'organization',
        cell: (item) => <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>,
        label: 'common:organization',
      },
      {
        id: 'offer',
        cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.offer}</OdsText>,
        label: 'zimbra_account_datagrid_offer_label',
      },
      {
        id: 'quota',
        cell: (item) => (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {formatBytes(item.used, 2, 1024)} / {formatBytes(item.available, 0, 1024)}
          </OdsText>
        ),
        label: 'zimbra_account_datagrid_quota',
      },
      {
        id: 'status',
        cell: (item) => <BadgeStatus status={item.status}></BadgeStatus>,
        label: `${NAMESPACES.STATUS}:status`,
      },
      {
        id: 'renewal_type',
        cell: (item) => <BillingStateBadge service={item.service} />,
        label: 'zimbra_account_datagrid_renewal_type',
      },
      {
        id: 'tooltip',
        cell: (item: EmailAccountItem) => <ActionButtonEmailAccount item={item} />,
        label: '',
      },
    ],
    [formatBytes],
  );

  return (
    <Datagrid
      topbar={<DatagridTopbar />}
      search={{
        searchInput,
        setSearchInput,
        onSearch: (search) => setDebouncedSearchInput(search),
      }}
      columns={columns.map((column) => ({
        ...column,
        label: t(column.label),
      }))}
      items={items}
      totalItems={items.length}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      onFetchAllPages={fetchAllPages}
      isLoading={isLoading || isFetchingNextPage}
    />
  );
};

export default EmailAccountsDatagrid;
