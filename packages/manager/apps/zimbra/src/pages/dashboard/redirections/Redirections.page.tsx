import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { RowSelectionState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, ICON_NAME, Icon, TEXT_PRESET } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button, Datagrid, DatagridColumn, Text } from '@ovh-ux/muk';

import { BadgeStatus } from '@/components';
import { MAX_REDIRECTIONS_QUOTA } from '@/constants';
import { ResourceStatus } from '@/data/api';
import { useOrganizations, usePlatform, useRedirections } from '@/data/hooks';
import { useDebouncedValue, useGenerateUrl } from '@/hooks';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButton from './ActionButton.component';
import { RedirectionItem } from './Redirections.types';

const columns: DatagridColumn<RedirectionItem>[] = [
  {
    id: 'from',
    accessorKey: 'from',
    label: 'zimbra_redirections_from',
    isSearchable: true,
    enableHiding: true,
  },
  {
    id: 'to',
    accessorKey: 'to',
    label: 'zimbra_redirections_to',
    isSearchable: true,
    enableHiding: true,
  },
  {
    id: 'organization',
    accessorKey: 'organization',
    label: 'common:organization',
  },
  {
    id: 'status',
    accessorKey: 'status',
    cell: ({ getValue }) => <BadgeStatus status={getValue<keyof typeof ResourceStatus>()} />,
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    maxSize: 50,
    cell: ({ row }) => <ActionButton data-testid="add-redirection-btn" item={row.original} />,
    label: '',
  },
];

export const Redirections = () => {
  const { t } = useTranslation(['redirections', 'common', NAMESPACES.STATUS]);
  const navigate = useNavigate();
  const location = useLocation();
  const { platformUrn } = usePlatform();
  const { accountId } = useParams();
  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedRows, setSelectedRows] = useState<RedirectionItem[]>([]);
  const hrefAddRedirection = useGenerateUrl('./add', 'path');
  const hrefDeleteSelectedRedirection = useGenerateUrl('./delete_all', 'path');
  const { data: organizations } = useOrganizations();
  const { clearSelectedRedirections } = location.state || {};
  const {
    data: redirections,
    isLoading,
    hasNextPage,
    fetchNextPage,
    fetchAllPages,
  } = useRedirections({
    destination: debouncedSearchInput,
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });

  useEffect(() => {
    if (clearSelectedRedirections) {
      setRowSelection({});
      setSelectedRows([]);
    }
  }, [clearSelectedRedirections]);

  const handleAddEmailRedirectionClick = () => {
    navigate(hrefAddRedirection);
  };

  const handleDeleteSelectedRedirectionClick = () => {
    navigate(hrefDeleteSelectedRedirection, {
      state: {
        selectedRedirections: selectedRows.map((row) => ({
          id: row?.id,
          from: row?.from,
          to: row?.to,
        })),
      },
    });
  };

  const isRowSelectable = useCallback(
    (item: RedirectionItem) => item.status === ResourceStatus.READY,
    [],
  );

  const items = useMemo(() => {
    return (
      redirections?.map((redirection) => ({
        id: redirection.id,
        from: redirection.currentState.source,
        to: redirection.currentState.destination,
        status: redirection.resourceStatus,
        organization: organizations?.find((o) => o.id === redirection?.currentState?.organizationId)
          ?.currentState?.name,
      })) ?? []
    );
  }, [redirections, organizations]);

  useEffect(() => {
    setSelectedRows(items?.filter((item) => rowSelection[item.id]));
  }, [items, rowSelection]);

  const topbar = useMemo(
    () => (
      <div className="flex gap-6">
        <Button
          color={BUTTON_COLOR.primary}
          size={BUTTON_SIZE.sm}
          onClick={handleAddEmailRedirectionClick}
          urn={platformUrn}
          iamActions={[IAM_ACTIONS.redirection.create]}
          data-testid="add-redirection-btn"
          id="add-redirection-btn"
        >
          <>
            <Icon name={ICON_NAME.plus} />
            {t('common:add_redirection')}
          </>
        </Button>
        {!!selectedRows?.length && (
          <Button
            color={BUTTON_COLOR.critical}
            size={BUTTON_SIZE.sm}
            onClick={handleDeleteSelectedRedirectionClick}
            urn={platformUrn}
            iamActions={[IAM_ACTIONS.redirection.delete]}
            data-testid="delete-all-redirection-btn"
            id="delete-all-redirection-btn"
          >
            <>
              <Icon name={ICON_NAME.trash} />
              {`${t('common:delete_redirections')} (${selectedRows.length})`}
            </>
          </Button>
        )}
      </div>
    ),
    [platformUrn, selectedRows, platformUrn],
  );

  return (
    <div>
      <Outlet />
      {accountId && (
        <div className="mb-6">
          <Text preset={TEXT_PRESET.heading3}>{t('zimbra_redirections_account_title')}</Text>
        </div>
      )}
      <div className="mb-6 flex gap-8" data-testid="account-offers">
        <Text
          preset={TEXT_PRESET.heading6}
          className="mr-4"
          urn={platformUrn}
          iamActions={[IAM_ACTIONS.account.get]}
        >
          {`${t('zimbra_redirections_account_quota')} :`}
        </Text>
        <Text
          urn={platformUrn}
          iamActions={[IAM_ACTIONS.account.get]}
        >{`${redirections?.length} / ${MAX_REDIRECTIONS_QUOTA}`}</Text>
      </div>
      <Datagrid
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
        topbar={topbar}
        columns={columns.map((column) => ({
          ...column,
          header: t(column.label),
        }))}
        data={items}
        totalCount={items?.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
        containerHeight={500}
      />
    </div>
  );
};

export default Redirections;
