import { useTranslation } from 'react-i18next';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import {
  ActionMenu,
  ActionMenuItem,
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  ManagerButton,
  Notifications,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useAuthorization } from '@/hooks';
import { NotificationRouting } from '@/data/types/routing.type';
import { useAccountUrn } from '@/data';
import { getNotificationRoutingQueryKey } from '@/data/api/routing';
import {
  NotificationRoutingActions,
  displayActionMenuItem,
} from './settings.constants';
import RoutingStatusChip from '@/components/routingStatus/RoutingStatus.component';

function RoutingActionMenu({ routing }: { routing: NotificationRouting }) {
  const { t } = useTranslation(['settings', NAMESPACES.ACTIONS, 'common']);
  // const { addSuccess, addError, clearNotifications } = useNotifications();
  const { data: accountUrn } = useAccountUrn();

  const items = useMemo(
    () =>
      [
        displayActionMenuItem(routing, NotificationRoutingActions.ENABLE) && {
          id: 1,
          label: t('activate', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {},
          iamActions: ['account:apiovh:notification/routing/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(routing, NotificationRoutingActions.DISABLE) && {
          id: 2,
          label: t('table_action_deactivate'),
          onClick: () => {},
          iamActions: ['account:apiovh:notification/routing/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(routing, NotificationRoutingActions.EDIT) && {
          id: 3,
          label: t('modify', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {},
          iamActions: ['account:apiovh:notification/routing/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(routing, NotificationRoutingActions.DELETE) && {
          id: 4,
          label: t('delete', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {},
          iamActions: ['account:apiovh:notification/routing/delete'],
          urn: accountUrn,
        },
      ].filter(Boolean) as ActionMenuItem[],
    [t, routing],
  );

  return (
    <ActionMenu
      id={routing.id}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      aria-label={t('actions_menu_label')}
    />
  );
}

function SettingsPage() {
  const { t } = useTranslation(['settings', 'common']);
  const { data: accountUrn } = useAccountUrn();
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/routing/get',
  ]);

  const columns: DatagridColumn<NotificationRouting>[] = useMemo(
    () => [
      {
        id: 'name',
        label: t('table_column_name'),
        isSortable: false,
        cell: ({ name }) => (
          <DataGridTextCell className="truncate">{name}</DataGridTextCell>
        ),
      },
      {
        id: 'status',
        label: t('table_column_status'),
        isSortable: false,
        size: 50,
        cell: ({ active }) => (
          <DataGridTextCell>
            <RoutingStatusChip active={active} />
          </DataGridTextCell>
        ),
      },
      {
        id: 'actions',
        label: '',
        size: 50,
        isSortable: false,
        cell: (routing) => (
          <div className="flex flex-row justify-center">
            <RoutingActionMenu routing={routing} />
          </div>
        ),
      }
    ],
    [t],
  );

  const {
    flattenData,
    isLoading: isLoadingRouting,
    hasNextPage,
    fetchNextPage,
  } = useResourcesIcebergV2<NotificationRouting>({
    columns,
    route: '/notification/routing',
    queryKey: getNotificationRoutingQueryKey(),
    enabled: isAuthorized,
  });

  const isLoading = isLoadingRouting || isLoadingAuthorization;

  return (
    <div className="flex flex-col gap-4">
      <OdsText preset="paragraph" className="mb-6">
        {t('description')}
      </OdsText>

      {!isLoading && !isAuthorized && (
        <OdsMessage color="warning" isDismissible={false} className="w-full">
          {t('common:iam_display_content_message', { ns: 'common' })}
        </OdsMessage>
      )}

      <Notifications clearAfterRead />

      <Datagrid
        items={flattenData}
        columns={columns}
        isLoading={isLoading}
        tableLayoutFixed={true}
        topbar={
          <ManagerButton
            id="add-routing-button"
            iamActions={['account:apiovh:notification/routing/create']}
            urn={accountUrn}
            icon="plus"
            label={t('add_routing_button')}
            aria-label={t('add_routing_button')}
            size="sm"
            onClick={() => {}}
          />
        }
        totalItems={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        manualSorting={true}
      />

      <Outlet />
    </div>
  );
}

export default SettingsPage;
