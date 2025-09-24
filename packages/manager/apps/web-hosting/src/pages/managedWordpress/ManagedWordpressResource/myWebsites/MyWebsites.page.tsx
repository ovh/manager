import { useCallback, useMemo, useState } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

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
import { useGenerateUrl } from '@/hooks';

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
  ]);
  const { serviceName } = useParams();
  const { data } = useManagedWordpressWebsites(serviceName);
  const { data: dataResourceDetails } = useManagedWordpressResourceDetails(serviceName);
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const importPage = useGenerateUrl(`./import`, 'href');
  const createPage = useGenerateUrl(`./create`, 'href');

  const deleteModalBase = useGenerateUrl('./delete-modal', 'path');

  const handleImportClick = () => {
    window.location.href = importPage;
  };
  const handleCreateClick = () => {
    window.location.href = createPage;
  };

  const selectedIds = Object.keys(rowSelection);

  const handleDeleteModalClick = () => {
    const deleteModal = `${deleteModalBase}?websiteIds=${selectedIds.join(',')}`;
    navigate(deleteModal);
  };

  const handleManageClick = () => {
    const url = dataResourceDetails?.currentState?.dashboards?.wordPress;
    window.open(url, '_blank');
  };

  const isRowSelectable = useCallback(
    (item: ManagedWordpressWebsites) =>
      (item.resourceStatus as ResourceStatus) === ResourceStatus.READY,
    [],
  );

  const columns: DatagridColumn<ManagedWordpressWebsites>[] = useMemo(() => {
    const handleDeleteItemClick = (id: string) => {
      const deleteModal = `${deleteModalBase}?websiteIds=${id}`;
      navigate(deleteModal);
    };

    return [
      {
        id: 'defaultFQDN',
        cell: (item) => (
          <div>
            {!item.currentState.defaultFQDN
              ? t('common:web_hosting_status_creating_label')
              : item.currentState.defaultFQDN}
          </div>
        ),
        label: t('common:web_hosting_status_header_fqdn'),
        isSortable: true,
      },
      {
        id: 'delete',
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
        isSortable: true,
        enableHiding: false,
      },
    ];
  }, [t, deleteModalBase, navigate, isRowSelectable]);

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
        items={data || []}
        totalItems={data?.length || 0}
        topbar={
          <>
            <OdsText preset={ODS_TEXT_PRESET.span} className="mb-4">
              {t('dashboard:hosting_managed_wordpress_websites_description')}
            </OdsText>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 m-4">
                <ManagerButton
                  id={'my-websites-create'}
                  label={t(`${NAMESPACES.ACTIONS}:create`)}
                  onClick={handleCreateClick}
                ></ManagerButton>
                <ManagerButton
                  id={'my-websites-import'}
                  label={t('common:web_hosting_action_import')}
                  variant={ODS_BUTTON_VARIANT.outline}
                  onClick={handleImportClick}
                ></ManagerButton>
                <ManagerButton
                  id={'my-websites-manage'}
                  label={t('common:web_hosting_action_manage_my_sites')}
                  variant={ODS_BUTTON_VARIANT.outline}
                  icon={ODS_ICON_NAME.externalLink}
                  onClick={handleManageClick}
                  isDisabled={!data}
                />
                {Object.keys(rowSelection).length > 0 && (
                  <ManagerButton
                    id={'my-websites-delete-all'}
                    label={
                      Object.keys(rowSelection).length > 1
                        ? t('common:delete_my_websites')
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
              </div>
            </div>
          </>
        }
      />
      <Outlet />
    </>
  );
}
