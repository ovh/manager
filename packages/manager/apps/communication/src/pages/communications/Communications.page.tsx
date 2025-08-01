import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import {
  FilterTypeCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { OdsButton, OdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link } from 'react-router-dom';
import { Notification } from '@/data/types';
import { urls } from '@/routes/routes.constant';

import NotificationPriorityChip from '@/components/notificationPriorityChip/NotificationPriorityChip.component';
import {
  useNotificationHistory,
  useNotificationReference,
} from '@/data/hooks/useNotification/useNotification';
import NotificationContactStatus from '@/components/notificationContactStatus/NotificationContactStatus.component';
import { useAuthorization } from '@/hooks/useAuthorization/useAuthorization';

function CommunicationsPage() {
  const { t } = useTranslation('communications');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const formatDate = useFormatDate();
  const { data: reference } = useNotificationReference();

  const { isAuthorized } = useAuthorization([
    'account:apiovh:notification/history/get',
  ]);

  const columns: DatagridColumn<Notification>[] = [
    {
      id: 'title',
      isSearchable: true,
      label: t('table_column_subject'),
      cell: (notification) => (
        <DataGridTextCell>
          <Link to={`${urls.CommunicationsDetailTo(notification.id)}`}>
            <OdsLink label={notification.title} href="#" />
          </Link>
        </DataGridTextCell>
      ),
    },
    {
      id: 'status',
      label: '',
      isFilterable: true,
      cell: (notification) => (
        <DataGridTextCell>
          <NotificationContactStatus
            contacts={notification.contacts}
            notificationId={notification.id}
          />
        </DataGridTextCell>
      ),
    },
    {
      id: 'priority',
      label: t('table_column_priority'),
      isFilterable: true,
      type: FilterTypeCategories.Options,
      comparator: [FilterComparator.IsEqual],
      filterOptions: reference?.priorities?.map(({ name }) => ({
        label: t(`priority_${name.toLowerCase()}`),
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
      type: FilterTypeCategories.Options,
      comparator: [FilterComparator.IsEqual],
      filterOptions: reference?.categories?.map(({ name }) => ({
        label: name,
        value: name,
      })),
      cell: (notification) => (
        <div className="max-w-min">
          <DataGridTextCell>
            {notification.categories.join(', ')}
          </DataGridTextCell>
        </div>
      ),
    },
  ];

  const {
    flattenData,
    isLoading,
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

  return (
    <>
      <Datagrid
        items={flattenData}
        columns={columns}
        sorting={sorting}
        onSortChange={setSorting}
        isLoading={isLoading || isRefetching}
        search={search}
        filters={filters}
        topbar={
          <OdsButton
            variant="outline"
            icon="refresh"
            label=""
            aria-label={tActions('refresh')}
            isLoading={isRefetching}
            size="sm"
            onClick={() => refetch()}
          />
        }
        totalItems={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        manualSorting={true}
      />
    </>
  );
}

export default CommunicationsPage;
