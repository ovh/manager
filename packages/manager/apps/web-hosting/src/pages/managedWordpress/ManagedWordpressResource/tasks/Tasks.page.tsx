import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsBadge, OdsButton, OdsProgressBar } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn, useFormatDate } from '@ovh-ux/manager-react-components';

import { useManagedWordpressResourceTasks } from '@/data/hooks/managedWordpress/managedWordpressResourceTasks/useManagedWordpressResourceTasks';
import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressResourceTask } from '@/data/types/product/managedWordpress/tasks';
import { Status } from '@/data/types/product/ssl';
import { getStatusColor } from '@/utils/getStatusColor';

export default function TasksPage() {
  const { serviceName } = useParams();
  const { t } = useTranslation(['common', NAMESPACES.DASHBOARD]);

  const { data, refetch, isFetching } = useManagedWordpressResourceTasks(serviceName);
  const formatDate = useFormatDate();
  const { data: websitesList } = useManagedWordpressWebsites(serviceName);

  const columns: DatagridColumn<ManagedWordpressResourceTask>[] = useMemo(
    () => [
      {
        id: 'defaultFqdn',
        cell: (item) => {
          const id = item?.link?.split('/').pop();

          const matchingItem = websitesList?.find((website) => website.id === id);

          return <>{matchingItem?.currentState.defaultFQDN}</>;
        },
        label: t('web_hosting_status_header_fqdn'),
      },
      {
        id: 'type',
        cell: (item) => {
          return <span>{t(`common:web_hosting_common_type_${item.type.toLowerCase()}`)}</span>;
        },
        label: t(`${NAMESPACES.DASHBOARD}:type`),
      },
      {
        id: 'status',
        cell: (item) => {
          const statusColor = getStatusColor(item.status);
          return (
            <OdsBadge
              color={statusColor}
              label={t(`web_hosting_status_${item.status.toLocaleLowerCase()}`)}
            />
          );
        },
        label: t('web_hosting_header_status'),
      },
      {
        id: 'progress',
        cell: (item) => {
          let progress = parseInt(item.message?.replace(/\D/g, '') || '', 10) || 0;

          if (item.status === Status.DONE) {
            progress = 100;
          }

          return (
            <div>
              <OdsProgressBar max={100} value={progress} className="mr-4" />
              {progress}%
            </div>
          );
        },
        label: t('web_hosting_header_progress'),
      },
      {
        id: 'comments',
        cell: (item) => <div>{item.message?.replace(/\d+%?/g, '').trim() || ''}</div>,
        label: t('web_hosting_header_comments'),
        isSortable: true,
      },
      {
        id: 'startedAt',
        cell: (item) => <div>{formatDate({ date: item.startedAt, format: 'Pp' })}</div>,
        label: t('web_hosting_common_creation_date'),
        isSortable: true,
      },
      {
        id: 'updatedAt',
        cell: (item) => <div>{formatDate({ date: item.updatedAt, format: 'Pp' })}</div>,
        label: t('web_hosting_common_update_date'),
        isSortable: true,
      },
    ],
    [t, formatDate, websitesList],
  );
  const handleRefreshClick = () => {
    void refetch();
  };
  return (
    <>
      <div className="mb-4 mt-4 flex justify-end">
        <OdsButton
          onClick={() => handleRefreshClick()}
          data-testid="refresh"
          label={''}
          icon={ODS_ICON_NAME.refresh}
          variant={ODS_BUTTON_VARIANT.outline}
          isLoading={isFetching}
        ></OdsButton>
      </div>
      <Datagrid columns={columns} items={data || []} totalItems={data?.length || 0} />
    </>
  );
}
