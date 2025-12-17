import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  ActionMenuItemProps,
  Datagrid,
  DatagridColumn,
  Button as ManagerButton,
  Notifications,
  useNotifications,
  useDataApi,
} from '@ovh-ux/muk';
import { BUTTON_VARIANT, Message, Text, Icon } from '@ovhcloud/ods-react';
import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useAuthorization } from '@/hooks';
import { NotificationRouting } from '@/data/types/routing.type';
import { useAccountUrn } from '@/data';
import { getNotificationRoutingListQueryKey } from '@/data/api/routing';
import {
  NotificationRoutingActions,
  displayActionMenuItem,
} from './settings.constants';
import RoutingStatusChip from '@/components/routing/routingStatus/RoutingStatus.component';
import { urls } from '@/routes/routes.constant';
import { useUpdateRoutingStatus } from '@/data/hooks/useNotificationRouting/useNotificationRouting';
import RoutingError from '@/components/routing/routingError/RoutingError.component';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

function RoutingActionMenu({ routing }: { routing: NotificationRouting }) {
  const { t } = useTranslation(['settings', NAMESPACES.ACTIONS, 'common']);
  const navigate = useNavigate();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { data: accountUrn } = useAccountUrn();
  const { trackClick, trackErrorBanner, trackInfoBanner } = useTracking();

  const trackDatagridActionClick = (actions: string[]) =>
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions,
      subApp: TrackingSubApps.Settings,
    });

  const { mutate: updateRoutingStatus } = useUpdateRoutingStatus({
    routingId: routing.id,
    onSuccess: (r) => {
      clearNotifications();
      addSuccess(t('edit_routing_success_message'));
      trackInfoBanner({
        pageName: `${r.active ? 'activate' : 'deactivate'}_rule_success_${t(
          'edit_routing_success_message',
        )}`,
        subApp: TrackingSubApps.Settings,
      });
    },
    onError: () => {
      clearNotifications();
      addError(t('edit_routing_error_message'));
      trackErrorBanner({
        pageName: `${routing.active ? 'activate' : 'deactivate'}_rule_error_${t(
          'edit_routing_error_message',
        )}`,
        subApp: TrackingSubApps.Settings,
      });
    },
  });

  const items = useMemo(
    () =>
      [
        displayActionMenuItem(routing, NotificationRoutingActions.ENABLE) && {
          id: 1,
          label: t('activate', { ns: NAMESPACES.ACTIONS }),
          onClick: () => updateRoutingStatus(true),
          iamActions: ['account:apiovh:notification/routing/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(routing, NotificationRoutingActions.DISABLE) && {
          id: 2,
          label: t('table_action_deactivate'),
          onClick: () => {
            trackDatagridActionClick(['deactivate_rule']);
            updateRoutingStatus(false);
          },
          iamActions: ['account:apiovh:notification/routing/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(routing, NotificationRoutingActions.EDIT) && {
          id: 3,
          label: t('modify', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {
            trackDatagridActionClick(['modify_rule']);
            navigate(urls.routing.editTo(routing.id));
          },
          iamActions: ['account:apiovh:notification/routing/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(routing, NotificationRoutingActions.DELETE) && {
          id: 4,
          label: t('delete', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {
            trackDatagridActionClick(['delete_rule']);
            navigate(urls.routing.deleteTo(routing.id));
          },
          iamActions: ['account:apiovh:notification/routing/delete'],
          urn: accountUrn,
        },
      ].filter(Boolean) as ActionMenuItemProps[],
    [t, routing],
  );

  return (
    <ActionMenu
      id={routing.id}
      items={items}
      isCompact
      variant={BUTTON_VARIANT.ghost}
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

  const navigate = useNavigate();
  const { trackClick } = useTracking();

  const columns: DatagridColumn<NotificationRouting>[] = useMemo(
    () => [
      {
        id: 'name',
        label: t('table_column_name'),
        header: t('table_column_name'),
        accessorKey: 'name',
        isSortable: false,
        cell: ({ row }) => (
          <Text className="truncate">{row.original.name}</Text>
        ),
      },
      {
        id: 'status',
        label: t('table_column_status'),
        header: t('table_column_status'),
        accessorKey: 'status',
        isSortable: false,
        size: 50,
        cell: ({ row }) => (
          <Text>
            <RoutingStatusChip active={row.original.active} />
          </Text>
        ),
      },
      {
        id: 'error',
        isSortable: false,
        size: 50,
        cell: ({ row }) => (
          <div className="flex flex-row justify-center">
            <RoutingError rules={row.original.rules} />
          </div>
        ),
      },
      {
        id: 'actions',
        label: '',
        size: 50,
        isSortable: false,
        cell: ({ row }) => (
          <div className="flex flex-row justify-center">
            <RoutingActionMenu routing={row.original} />
          </div>
        ),
      },
    ],
    [t],
  );

  const {
    flattenData,
    isLoading: isLoadingRouting,
    hasNextPage,
    fetchNextPage,
  } = useDataApi<NotificationRouting>({
    version: 'v2',
    iceberg: true,
    columns,
    route: '/notification/routing',
    defaultSorting: [{
      id: 'createdAt',
      desc: true,
    }],
    cacheKey: getNotificationRoutingListQueryKey(),
    enabled: isAuthorized,
  });

  const isLoading = isLoadingRouting || isLoadingAuthorization;
  const containerHeight = useMemo(() => {
    const length = flattenData?.length || 1;
    if (length <= 10) {
      return 66 * length + 50
    }
    return 710;
  }, [flattenData]);

  return (
    <div className="flex flex-col gap-4">
      <Text preset="paragraph" className="mb-6">
        {t('description')}
      </Text>

      {!isLoading && !isAuthorized && (
        <Message color="warning" dismissible={false} className="w-full">
          {t('iam_display_content_message', { ns: 'common' })}
        </Message>
      )}

      <Notifications clearAfterRead />

      <Datagrid<NotificationRouting>
        data={flattenData || []}
        columns={columns}
        isLoading={isLoading}
        containerHeight={containerHeight}
        topbar={
          <ManagerButton
            id="add-routing-button"
            iamActions={['account:apiovh:notification/routing/create']}
            urn={accountUrn}
            aria-label={t('add_routing_button')}
            size="sm"
            onClick={() => {
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['create_rule'],
                subApp: TrackingSubApps.Settings,
              });
              navigate(urls.routing.create);
            }}
          >
            <>
              <Icon name="plus" />
              {t('add_routing_button')}
            </>
          </ManagerButton>
        }
        totalCount={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={{
          sorting: [],
          setSorting: () => {},
          manualSorting: true,
        }}
      />

      <Outlet />
    </div>
  );
}

export default SettingsPage;
