import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useFormatDate, Link as ManagerLink, LinkType } from '@ovh-ux/muk';
import {
  FilterTypeCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { Button, Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link as RouterLink } from 'react-router-dom';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Notification } from '@/data/types';
import { urls } from '@/routes/routes.constant';
import NotificationPriorityChip from '@/components/notificationPriorityChip/NotificationPriorityChip.component';
import {
  useNotificationHistory,
  useNotificationReference,
} from '@/data/hooks/useNotification/useNotification';
import NotificationContactStatus from '@/components/notificationContactStatus/NotificationContactStatus.component';
import { useAuthorization } from '@/hooks/useAuthorization/useAuthorization';
import useCategories from '@/hooks/useCategories/useCategories';
import useHelpLink from '@/hooks/useHelpLink/useHelpLink';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

function CommunicationsPage() {
  const { trackClick } = useTracking();
  const { t } = useTranslation('communications');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { t: tCommon } = useTranslation('common');
  const formatDate = useFormatDate();
  const { data: reference } = useNotificationReference();

  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/history/get',
  ]);

  const columns: DatagridColumn<Notification>[] = [
    {
      id: 'title',
      isSearchable: true,
      isSortable: false,
      label: t('table_column_subject'),
      cell: (notification) => (
        <div className="!min-w-min">
          <DataGridTextCell>
            <Link
              as={RouterLink}
              to={urls.communication.detailTo(notification.id)}
              onClick={() =>
                trackClick({
                  location: PageLocation.datagrid,
                  buttonType: ButtonType.button,
                  actionType: 'navigation',
                  actions: ['detail_subject'],
                  subApp: TrackingSubApps.Communications,
                })
              }
              className="max-w-fit inline"
            >
              {notification.title}
            </Link>
          </DataGridTextCell>
          </div>
      ),
    },
    {
      id: 'status',
      label: '',
      isFilterable: true,
      isSortable: false,
      cell: (notification) => (
        <DataGridTextCell>
          <NotificationContactStatus
            contacts={notification.contacts}
          />
        </DataGridTextCell>
      ),
    },
    {
      id: 'priority',
      label: t('table_column_priority'),
      isFilterable: true,
      isSortable: false,
      type: FilterTypeCategories.Options,
      comparator: [FilterComparator.IsEqual],
      filterOptions: reference?.priorities?.map(({ name }) => ({
        label: tCommon(`priority_${name.toLowerCase()}`),
        value: name,
      })),
      cell: (notification) => (
        <DataGridTextCell>
          <NotificationPriorityChip priority={notification.priority} />
        </DataGridTextCell>
      ),
    },
    {
      id: 'createdAt',
      label: t('table_column_date'),
      cell: (notification) => (
        <DataGridTextCell>
          {formatDate({ date: notification.createdAt, format: 'Pp' })}
        </DataGridTextCell>
      ),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Date,
      comparator: [FilterComparator.IsBefore, FilterComparator.IsAfter],
    },
    {
      id: 'category',
      label: t('table_column_categories'),
      isFilterable: true,
      isSortable: false,
      type: FilterTypeCategories.Options,
      comparator: [FilterComparator.IsEqual],
      filterOptions: reference?.categories?.map(({ name }) => ({
        label: tCommon(`category_${name.toLowerCase()}`),
        value: name,
      })),
      cell: (notification) => (
        <div className="!min-w-min max-w-[200px]">
          <DataGridTextCell>
            {useCategories(tCommon, notification.categories)}
          </DataGridTextCell>
        </div>
      ),
    },
  ];

  const {
    flattenData,
    isLoading: isLoadingNotificationHistory,
    isRefetching,
    refetch,
    sorting,
    setSorting,
    filters,
    search,
    hasNextPage,
    fetchNextPage,
  } = useNotificationHistory({
    pageSize: 10,
    enabled: isAuthorized,
  });

  const isLoading = isLoadingNotificationHistory || isLoadingAuthorization;
  const helpLink = useHelpLink();

  return (
    <>
      <Text className="mb-6">
        <Trans
          i18nKey="description"
          t={tCommon}
          components={{
            anchor: (
              <ManagerLink
                href={helpLink}
                onClick={() =>
                  trackClick({
                    location: PageLocation.page,
                    buttonType: ButtonType.externalLink,
                    actionType: 'navigation',
                    actions: ['go-to-assistance'],
                    subApp: TrackingSubApps.Communications,
                  })
                }
                target="_blank"
                type={LinkType.external}
              >
                {tCommon('assistance_link_label')}
              </ManagerLink>
            ),
          }}
        />
      </Text>
      {!isLoading && !isAuthorized && (
        <Message
          color="warning"
          dismissible={false}
          className="mb-8 w-full"
        >
          <MessageIcon name="circle-info" />
          <MessageBody>
            {tCommon('iam_display_content_message')}
          </MessageBody>
        </Message>
      )}
      <div className="box-border">
      <Datagrid
        items={flattenData}
        columns={columns}
        sorting={sorting}
        onSortChange={setSorting}
        isLoading={isLoading || isRefetching}
        search={search}
        filters={filters}
        topbar={
          <Button
            variant="outline"
            aria-label={tActions('refresh')}
            loading={isRefetching}
            size="sm"
            onClick={() => refetch()}
          >
            <Icon name="refresh" />
          </Button>
        }
        totalItems={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        manualSorting={true}
      />
      </div>
    </>
  );
}

export default CommunicationsPage;
