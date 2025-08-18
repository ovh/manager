import { useMemo, useState } from 'react';
import {
  ActionMenu,
  Datagrid,
  DatagridColumn,
  ManagerButton,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressWebsites, ResourceStatus } from '@/data/type';
import { useGenerateUrl } from '@/hooks';
import { useManagedWordpressResourceDetails } from '@/data/hooks/managedWordpressResourceDetails/useManagedWordpressResourceDetails';
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
  ]);
  const { serviceName } = useParams();
  const { data } = useManagedWordpressWebsites(serviceName);
  const { data: dataResourceDetails } = useManagedWordpressResourceDetails(
    serviceName,
  );
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const importPage = useGenerateUrl(`./import`, 'href');
  const deleteModalBase = useGenerateUrl('./delete-modal', 'path');

  const handleImportClick = () => {
    window.location.href = importPage;
  };

  const selectedIds = Object.keys(rowSelection);

  const handleDeleteModalClick = () => {
    const deleteModal = `${deleteModalBase}?websiteIds=${selectedIds.join(
      ',',
    )}`;
    navigate(deleteModal);
  };

  const handleDeleteItemClick = (id: string) => {
    const deleteModal = `${deleteModalBase}?websiteIds=${id}`;
    navigate(deleteModal);
  };

  const handleManageClick = () => {
    const url = dataResourceDetails?.currentState?.dashboards?.wordPress;
    window.open(url, '_blank');
  };

  const isRowSelectable = (item: ManagedWordpressWebsites) => {
    return item.resourceStatus === ResourceStatus.READY;
  };

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
        label: t('common:web_hosting_status_header_fqdn'),
        isSortable: true,
      },
      {
        id: 'resourceStatus',
        cell: (item) => {
          const statusColor = getStatusColor(item.resourceStatus);
          return (
            <OdsBadge
              color={statusColor}
              label={t(
                `common:web_hosting_status_${item.resourceStatus.toLocaleLowerCase()}`,
              )}
            />
          );
        },
        label: t(`${NAMESPACES.STATUS}:status`),
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
    ],
    [t],
  );

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
          <div className="flex items-center justify-between">
            <div className="flex gap-4 m-4">
              <ManagerButton
                id={'my-websites-create'}
                label={t(`${NAMESPACES.ACTIONS}:create`)}
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
            </div>
          </div>
        }
      />
      <Outlet />
    </>
  );
}
