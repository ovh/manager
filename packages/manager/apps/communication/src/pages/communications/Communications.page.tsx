import {
  Datagrid,
  DatagridColumn,
  useFormatDate,
} from '@ovh-ux/muk';
import {
  FilterTypeCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import {
  Button,
  Icon,
  Link,
  Message,
  Text,
} from '@ovhcloud/ods-react';
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
import { useMemo } from 'react';

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
      header: t('table_column_subject'),
      cell: ({ row }) => (
        <Text>
          <Link
            href={`#${urls.communication.detailTo(row.original.id)}`}
            onClick={() =>
              trackClick({
                location: PageLocation.datagrid,
                buttonType: ButtonType.button,
                actionType: 'navigation',
                actions: ['detail_subject'],
                subApp: TrackingSubApps.Communications,
              })
            }
          >
            {row.original.title}
          </Link>
        </Text>
      ),
    },
    {
      id: 'status',
      isFilterable: true,
      isSortable: false,
      cell: ({ row }) => (
        <Text>
          <NotificationContactStatus
            contacts={row.original.contacts}
            notificationId={row.original.id}
          />
        </Text>
      ),
    },
    {
      id: 'priority',
      label: t('table_column_priority'),
      header: t('table_column_priority'),
      isFilterable: true,
      isSortable: false,
      type: FilterTypeCategories.Options,
      comparator: [FilterComparator.IsEqual],
      filterOptions: reference?.priorities?.map(({ name }) => ({
        label: tCommon(`priority_${name.toLowerCase()}`),
        value: name,
      })),
      cell: ({ row }) => (
        <Text>
          <NotificationPriorityChip priority={row.original.priority} />
        </Text>
      ),
    },
    {
      id: 'createdAt',
      label: t('table_column_date'),
      header: t('table_column_date'),
      cell: ({ row }) => (
        <Text>
          {formatDate({ date: row.original.createdAt, format: 'Pp' })}
        </Text>
      ),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Date,
      comparator: [FilterComparator.IsBefore, FilterComparator.IsAfter],
    },
    {
      id: 'category',
      label: t('table_column_categories'),
      header: t('table_column_categories'),
      isFilterable: true,
      isSortable: false,
      type: FilterTypeCategories.Options,
      comparator: [FilterComparator.IsEqual],
      filterOptions: reference?.categories?.map(({ name }) => ({
        label: tCommon(`category_${name.toLowerCase()}`),
        value: name,
      })),
      cell: ({ row }) => (
        <div className="min-w-[200px] max-w-min">
          <Text>
            {useCategories(tCommon, row.original.categories)}
          </Text>
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

  const containerHeight = useMemo(() => {
    const length = flattenData?.length || 1;
    if (length <= 10) {
      return (60 * length) + 50;
    }
    return 710;
  }, [flattenData]);

  return (
    <>
      <Text className="mb-6">
        <Trans
          i18nKey="description"
          t={tCommon}
          components={{
            anchor: (
              <Link
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
              >
                {tCommon('assistance_link_label')}
                <Icon name="external-link" />
              </Link>
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
          {tCommon('iam_display_content_message')}
        </Message>
      )}
      <Datagrid<Notification>
        data={flattenData || []}
        columns={columns}
        containerHeight={containerHeight}
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
        totalCount={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={{
          sorting: sorting ? [sorting] : [],
          setSorting: (newSorting: any) => {
            const sort = Array.isArray(newSorting) ? newSorting[0] : newSorting;
            if (sort && sort.id) {
              setSorting({ id: sort.id, desc: sort.desc ?? false });
            }
          },
          manualSorting: true,
        }}
      />
    </>
  );
}

export default CommunicationsPage;
