import { useCallback, useMemo, useState } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { RowSelectionState } from '@tanstack/react-table';
import { UUID } from 'node:crypto';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Badge,
  Button,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { useManagedWordpressResourceDetails } from '@/data/hooks/managedWordpress/managedWordpressResourceDetails/useManagedWordpressResourceDetails';
import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressWebsites } from '@/data/types/product/managedWordpress/website';
import { ResourceStatus } from '@/data/types/status';
import { useDebouncedValue, useGenerateUrl } from '@/hooks';
import { getStatusColor } from '@/utils/getStatusColor';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function MyWebsitesPage() {
  const { t } = useTranslation([
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
    'managedWordpress',
    'dashboard',
  ]);
  const { serviceName } = useParams<{ serviceName: string }>();
  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');
  const {
    data: websites,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchAllPages,
    refetch,
    isFetching,
  } = useManagedWordpressWebsites({ defaultFQDN: debouncedSearchInput });
  const websitesData = websites || [];
  const { data: resourceDetails, refetch: refetchResourceDetails } =
    useManagedWordpressResourceDetails(serviceName);
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const importPage = useGenerateUrl(`./import`, 'href');
  const createPage = useGenerateUrl(`./create`, 'href');
  const deleteModalBase = useGenerateUrl('./delete-modal', 'path');

  const handleImportClick = useCallback(() => {
    window.location.href = importPage;
  }, [importPage]);

  const handleCreateClick = useCallback(() => {
    window.location.href = createPage;
  }, [createPage]);

  const handleDeleteModalClick = useCallback(() => {
    const selectedIds = Object.keys(rowSelection);
    console.log(selectedIds);
    if (selectedIds.length > 0) {
      navigate(deleteModalBase, {
        state: {
          websiteIds: selectedIds,
          allPages: false,
        },
      });
    }
  }, [deleteModalBase, navigate, rowSelection]);

  const handleManageClick = useCallback(() => {
    const url = resourceDetails?.currentState?.dashboards?.wordpress;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [resourceDetails]);

  const handleDeleteItemClick = useCallback(
    (id: UUID) => {
      navigate(deleteModalBase, {
        state: {
          websiteIds: [id],
          allPages: false,
        },
      });
    },
    [deleteModalBase, navigate],
  );

  const handleRefreshClick = useCallback(() => {
    void refetch();
    void refetchResourceDetails();
  }, [refetch, refetchResourceDetails]);

  const isRowSelectable = useCallback(
    (item: ManagedWordpressWebsites) =>
      item.resourceStatus &&
      [ResourceStatus.READY, ResourceStatus.ERROR].includes(item.resourceStatus),
    [],
  );

  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);
  const getResource = (row: Record<string, unknown>): ManagedWordpressWebsites => {
    return row as ManagedWordpressWebsites;
  };

  const columns: DatagridColumn<Record<string, unknown>>[] = useMemo(
    () => [
      {
        id: 'defaultFQDN',
        accessorFn: (row) => getResource(row).currentState.defaultFQDN,
        cell: ({ row }) => (
          <div>
            {!getResource(row.original).currentState?.defaultFQDN
              ? t('common:web_hosting_status_creating_label')
              : getResource(row.original).currentState.defaultFQDN}
          </div>
        ),
        header: t('common:web_hosting_status_header_fqdn'),
        isSortable: true,
      },
      {
        id: 'resourceStatus',
        accessorFn: (row) => getResource(row).resourceStatus,
        cell: ({ row }) => {
          const status = getResource(row.original).resourceStatus;
          const statusColor = getStatusColor(status);
          return (
            <Badge color={statusColor}>
              {t(`common:web_hosting_status_${status?.toLowerCase()}`)}
            </Badge>
          );
        },
        header: t(`${NAMESPACES.STATUS}:status`),
      },
      {
        id: 'actions',
        accessorFn: (row) => getResource(row).id,
        cell: ({ row }) => (
          <ActionMenu
            items={[
              {
                id: 1,
                label: t(`${NAMESPACES.ACTIONS}:delete`),
                onClick: () => handleDeleteItemClick(getResource(row.original).id),
                color: BUTTON_COLOR.critical,
                isDisabled: !isRowSelectable(getResource(row.original)),
              },
            ]}
            isCompact
            variant={BUTTON_VARIANT.ghost}
            id={`action-menu-${getResource(row.original).id}`}
          />
        ),
        header: '',
      },
    ],
    [t, isRowSelectable, handleDeleteItemClick],
  );
  // Topbar
  const topbar = useMemo(
    () => (
      <>
        <Text preset={TEXT_PRESET.span} className="mb-4 block">
          {t('dashboard:hosting_managed_wordpress_websites_description')}
        </Text>
        <div className="flex flex-wrap items-center gap-4 m-4">
          <Button id="my-websites-create" onClick={handleCreateClick}>
            {t(`${NAMESPACES.ACTIONS}:create`)}
          </Button>
          <Button
            id="my-websites-import"
            variant={BUTTON_VARIANT.outline}
            onClick={handleImportClick}
          >
            {t('common:web_hosting_action_import')}
          </Button>
          <Button
            id="my-websites-manage"
            variant={BUTTON_VARIANT.outline}
            onClick={handleManageClick}
            disabled={!websites?.length}
          >
            {t('common:web_hosting_action_manage_my_sites')}
            <Icon name={ICON_NAME.externalLink} className="ml-2" />
          </Button>
          {selectedIds.length > 0 && (
            <Button
              id="my-websites-delete-all"
              color={BUTTON_COLOR.critical}
              variant={BUTTON_VARIANT.outline}
              onClick={handleDeleteModalClick}
            >
              {selectedIds.length > 1
                ? t('delete_my_websites', { number: selectedIds.length })
                : t('common:delete_my_website')}
              <Icon name={ICON_NAME.trash} className="ml-2" />
            </Button>
          )}
          <Text preset={TEXT_PRESET.span} className="self-center">
            {t('managedWordpress:web_hosting_managed_wordpress_quota_used', {
              used: resourceDetails?.currentState?.quotas?.websites?.totalUsage || 0,
              total: resourceDetails?.currentState?.quotas?.websites?.totalQuota || 0,
            })}
          </Text>
          <Button
            id="refresh"
            onClick={handleRefreshClick}
            data-testid="refresh"
            variant={BUTTON_VARIANT.outline}
            loading={isFetching}
            className="ml-auto"
          >
            <Icon name={ICON_NAME.refresh} />
          </Button>
        </div>
      </>
    ),
    [
      t,
      selectedIds,
      websites,
      resourceDetails,
      isFetching,
      handleCreateClick,
      handleImportClick,
      handleManageClick,
      handleDeleteModalClick,
      handleRefreshClick,
    ],
  );

  return (
    <>
      <Datagrid
        columns={columns}
        rowSelection={{
          rowSelection,
          setRowSelection,
        }}
        search={{
          searchInput,
          setSearchInput,
          onSearch: setDebouncedSearchInput,
        }}
        data={websites || []}
        totalCount={websitesData.length || 0}
        hasNextPage={!isFetchingNextPage && hasNextPage}
        onFetchNextPage={void fetchNextPage}
        onFetchAllPages={fetchAllPages}
        isLoading={isLoading || isFetchingNextPage}
        topbar={topbar}
      />
      <Outlet />
    </>
  );
}
