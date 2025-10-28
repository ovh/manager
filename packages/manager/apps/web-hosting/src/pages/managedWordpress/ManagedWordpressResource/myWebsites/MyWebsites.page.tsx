import { useCallback, useMemo, useState } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ActionMenu,
  Datagrid,
  DatagridColumn,
  ManagerButton,
} from '@ovh-ux/manager-react-components';

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
export type DashboardLayoutProps = { tabs: DashboardTabItemProps[] };
export default function MyWebsitesPage() {
  const { t } = useTranslation([
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
    'managedWordpress',
  ]);
  const { serviceName } = useParams();
  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchAllPages,
    refetch,
    isFetching,
  } = useManagedWordpressWebsites({ defaultFQDN: debouncedSearchInput });
  const { data: dataResourceDetails, refetch: isRetchDataDetails } =
    useManagedWordpressResourceDetails(serviceName);
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const importPage = useGenerateUrl(`./import`, 'href');
  const createPage = useGenerateUrl(`./create`, 'href');
  const items = useMemo(() => data ?? [], [data]);
  const selectedIds = Object.keys(rowSelection);
  const deleteModalBase = useGenerateUrl('./delete-modal', 'path');
  const handleImportClick = () => {
    window.location.href = importPage;
  };
  const handleCreateClick = () => {
    window.location.href = createPage;
  };
  const handleDeleteModalClick = () => {
    navigate(deleteModalBase, {
      state: {
        websiteIds: selectedIds,
        allPages: false,
      },
    });
  };

  const handleManageClick = () => {
    const url = dataResourceDetails?.currentState?.dashboards?.wordpress;
    window.open(url, '_blank');
  };
  const isRowSelectable = useCallback(
    (item: ManagedWordpressWebsites) =>
      [ResourceStatus.READY, ResourceStatus.ERROR].includes(item.resourceStatus as ResourceStatus),
    [],
  );
  const handleDeleteItemClick = useCallback(
    (id: string) => {
      navigate(deleteModalBase, {
        state: {
          websiteIds: [id],
          allPages: false,
        },
      });
    },
    [deleteModalBase, navigate],
  );
  const columns: DatagridColumn<ManagedWordpressWebsites>[] = useMemo(
    () => [
      {
        id: 'defaultFQDN',
        cell: (item) => (
          <div>
            {!item.currentState.defaultFQDN
              ? t('common:web_hosting_status_creating_label')
              : item.currentState.defaultFQDN}
          </div>
        ),
        // isSearchable: true,
        label: t('common:web_hosting_status_header_fqdn'),
        isSortable: true,
      },
      {
        id: 'resourceStatus',
        cell: (item) => {
          const statusColor = getStatusColor(item?.resourceStatus);
          return (
            <OdsBadge
              color={statusColor}
              label={t(`common:web_hosting_status_${item?.resourceStatus.toLocaleLowerCase()}`)}
            />
          );
        },
        label: t(`${NAMESPACES.STATUS}:status`),
      },
      {
        id: 'actions',
        cell: (item) => (
          <ActionMenu
            items={[
              {
                id: 1,
                label: t(`${NAMESPACES.ACTIONS}:delete`),
                onClick: () => handleDeleteItemClick(item.id),
                color: ODS_BUTTON_COLOR.critical,
                isDisabled: !isRowSelectable(item),
              },
            ]}
            isCompact
            variant={ODS_BUTTON_VARIANT.ghost}
            id={item.id}
          />
        ),
        label: '',
      },
    ],

    [t, isRowSelectable, handleDeleteItemClick],
  );
  const handleRefreshClick = () => {
    void refetch();
    void isRetchDataDetails();
  };
  return (
    <>
      <Datagrid
        columns={columns}
        getRowId={(row) => row.id}
        rowSelection={{
          rowSelection,
          setRowSelection,
          enableRowSelection: ({ original: item }) => isRowSelectable(item),
        }}
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
        items={items || []}
        totalItems={items.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
        isLoading={isLoading || isFetchingNextPage}
        topbar={
          <>
            <OdsText preset={ODS_TEXT_PRESET.span} className="mb-4 block">
              {t('dashboard:hosting_managed_wordpress_websites_description')}
            </OdsText>
            <div className="flex flex-wrap items-center gap-4 m-4">
              <ManagerButton
                id={'my-websites-create'}
                label={t(`${NAMESPACES.ACTIONS}:create`)}
                onClick={handleCreateClick}
              />
              <ManagerButton
                id={'my-websites-import'}
                label={t('common:web_hosting_action_import')}
                variant={ODS_BUTTON_VARIANT.outline}
                onClick={handleImportClick}
              />

              <ManagerButton
                id={'my-websites-manage'}
                label={t('common:web_hosting_action_manage_my_sites')}
                variant={ODS_BUTTON_VARIANT.outline}
                icon={ODS_ICON_NAME.externalLink}
                onClick={handleManageClick}
                isDisabled={items.length === 0}
              />

              {Object.keys(rowSelection).length > 0 && (
                <ManagerButton
                  id={'my-websites-delete-all'}
                  label={
                    Object.keys(rowSelection).length > 1
                      ? t('delete_my_websites', {
                          number: Object.keys(rowSelection).length,
                        })
                      : t('common:delete_my_website')
                  }
                  color={ODS_BUTTON_COLOR.critical}
                  variant={ODS_BUTTON_VARIANT.outline}
                  onClick={handleDeleteModalClick}
                  icon={ODS_ICON_NAME.trash}
                />
              )}
              <OdsText preset={ODS_TEXT_PRESET.span} className="self-center">
                {t('managedWordpress:web_hosting_managed_wordpress_quota_used', {
                  used: dataResourceDetails?.currentState.quotas.websites.totalUsage,
                  total: dataResourceDetails?.currentState.quotas.websites.totalQuota,
                })}
              </OdsText>
              <ManagerButton
                id="refresh"
                onClick={() => handleRefreshClick()}
                data-testid="refresh"
                label={''}
                icon={ODS_ICON_NAME.refresh}
                variant={ODS_BUTTON_VARIANT.outline}
                isLoading={isFetching}
                className="ml-auto"
              />
            </div>
          </>
        }
      />
      <Outlet />
    </>
  );
}
