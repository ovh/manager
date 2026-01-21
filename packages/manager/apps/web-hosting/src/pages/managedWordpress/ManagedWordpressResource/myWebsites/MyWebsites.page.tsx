import { useCallback, useMemo, useState } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { RowSelectionState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, Badge, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { useManagedWordpressResourceDetails } from '@/data/hooks/managedWordpress/managedWordpressResourceDetails/useManagedWordpressResourceDetails';
import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressWebsites } from '@/data/types/product/managedWordpress/website';
import { ResourceStatus } from '@/data/types/status';
import { useGenerateUrl } from '@/hooks';
import { getStatusColor } from '@/utils/getStatusColor';

export default function MyWebsitesPage() {
  const { t } = useTranslation([
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
    'managedWordpress',
    'dashboard',
  ]);

  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchAllPages,
    refetch,
    isFetching,
  } = useManagedWordpressWebsites();

  const { data: resourceDetails, refetch: refetchResourceDetails } =
    useManagedWordpressResourceDetails(serviceName);

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
    navigate(deleteModalBase, {
      state: {
        websiteIds: Object.keys(rowSelection),
        allPages: false,
      },
    });
  }, [navigate, deleteModalBase, rowSelection]);

  const handleManageClick = useCallback(() => {
    const url = resourceDetails?.currentState?.dashboards?.wordpress;
    if (url) window.open(url, '_blank');
  }, [resourceDetails]);

  const handleRefreshClick = useCallback(() => {
    void refetch();
    void refetchResourceDetails();
  }, [refetch, refetchResourceDetails]);

  const handleDeleteItemClick = useCallback(
    (id: string) => {
      navigate(deleteModalBase, {
        state: { websiteIds: [id], allPages: false },
      });
    },
    [navigate, deleteModalBase],
  );

  const isRowSelectable = (item: ManagedWordpressWebsites) =>
    [ResourceStatus.READY, ResourceStatus.ERROR].includes(item.resourceStatus);

  const columns: DatagridColumn<ManagedWordpressWebsites>[] = useMemo(
    () => [
      {
        id: 'defaultFQDN',
        accessorKey: 'currentState.defaultFQDN',
        cell: ({ getValue }) => {
          const defaultFQDN = getValue<string>();
          return (
            <div>{!defaultFQDN ? t('common:web_hosting_status_creating_label') : defaultFQDN}</div>
          );
        },
        header: t('common:web_hosting_status_header_fqdn'),
      },
      {
        id: 'resourceStatus',
        accessorKey: 'resourceStatus',
        cell: ({ getValue }) => {
          const status = getValue<ResourceStatus>();
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
        size: 48,
        cell: ({ row }) => (
          <ActionMenu
            items={[
              {
                id: 1,
                label: t(`${NAMESPACES.ACTIONS}:delete`),
                onClick: () => handleDeleteItemClick(row.original.id),
                color: BUTTON_COLOR.critical,
                isDisabled: !isRowSelectable(row.original),
              },
            ]}
            isCompact
            variant={BUTTON_VARIANT.ghost}
            id={row.id}
          />
        ),
        label: '',
      },
    ],
    [handleDeleteItemClick, t],
  );

  return (
    <>
      <Datagrid
        columns={data ? columns : []}
        rowSelection={{
          rowSelection,
          setRowSelection,
          enableRowSelection: (row) => {
            return isRowSelectable(row.original);
          },
        }}
        containerHeight={500}
        data={data ?? []}
        hasNextPage={!isFetchingNextPage && hasNextPage}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
        onFetchAllPages={fetchAllPages}
        isLoading={isLoading || isFetchingNextPage}
        topbar={
          <div>
            <Text preset={TEXT_PRESET.span} className="mb-4 block">
              {t('dashboard:hosting_managed_wordpress_websites_description')}
            </Text>
            <div className="m-4 flex flex-wrap items-center gap-4">
              <Button
                id="my-websites-create"
                data-testid="my-websites-create"
                onClick={handleCreateClick}
              >
                {t(`${NAMESPACES.ACTIONS}:create`)}
              </Button>
              <Button
                id="my-websites-import"
                data-testid="my-websites-import"
                variant={BUTTON_VARIANT.outline}
                onClick={handleImportClick}
              >
                {t('common:web_hosting_action_import')}
              </Button>
              <Button
                id="my-websites-manage"
                data-testid="my-websites-manage"
                variant={BUTTON_VARIANT.outline}
                onClick={handleManageClick}
                disabled={!data?.length}
              >
                <>
                  {t('common:web_hosting_action_manage_my_sites')}
                  <Icon name={ICON_NAME.externalLink} className="ml-2" />
                </>
              </Button>
              {!!Object.keys(rowSelection).length && (
                <Button
                  id="my-websites-delete-all"
                  data-testid="my-websites-delete-all"
                  color={BUTTON_COLOR.critical}
                  variant={BUTTON_VARIANT.outline}
                  onClick={handleDeleteModalClick}
                >
                  <>
                    {Object.keys(rowSelection).length > 1
                      ? t('delete_my_websites', {
                          number: Object.keys(rowSelection).length,
                        })
                      : t('common:delete_my_website')}
                    <Icon name={ICON_NAME.trash} className="ml-2" />
                  </>
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
          </div>
        }
      />
      <Outlet />
    </>
  );
}
