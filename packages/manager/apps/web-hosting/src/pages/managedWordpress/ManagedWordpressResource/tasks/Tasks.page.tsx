import { useParams } from 'react-router-dom';
import {
  Datagrid,
  DatagridColumn,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsButton,
  OdsProgressBar,
} from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useManagedWordpressResourceTasks } from '@/data/hooks/managedWordpressResourceTasks/useManagedWordpressResourceTasks';
import { ManagedWordpressResourceTask, ResourceStatus } from '@/data/type';
import { useManagedWordpressWebsiteDetails } from '@/data/hooks/managedWordpressWebsiteDetails/useManagedWordpressWebsiteDetails';
import { getStatusColor } from '@/utils/getStatusColor';

function extractIdsFromLink(link: string) {
  const match = link.match(
    /\/v2\/managedCMS\/resource\/([^/]+)\/website\/([^/]+)/,
  );
  if (!match) return null;
  return { websiteId: match[2] };
}

export default function TasksPage() {
  const { serviceName } = useParams();
  const { t } = useTranslation('common');

  const { data, refetch, isFetching } = useManagedWordpressResourceTasks(
    serviceName,
  );
  const formatDate = useFormatDate();
  const columns: DatagridColumn<ManagedWordpressResourceTask>[] = useMemo(
    () => [
      {
        id: 'defaultFqdn',
        cell: (item) => {
          const ids = extractIdsFromLink(item.link);
          if (!ids) return <div>Waiting fqdn by api</div>;

          const { data: websiteDetails } = useManagedWordpressWebsiteDetails(
            serviceName,
            ids.websiteId,
          );
          return <>{websiteDetails?.currentState?.defaultFQDN}</>;
        },
        label: t('web_hosting_status_header_fqdn'),
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
          let progress =
            parseInt(item.message?.replace(/\D/g, '') || '', 10) || 0;

          if (item.status === (ResourceStatus.DONE as string)) {
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
        cell: (item) => (
          <div>{item.message?.replace(/\d+%?/g, '').trim() || ''}</div>
        ),
        label: t('web_hosting_header_comments'),
        isSortable: true,
      },
      {
        id: 'startedAt',
        cell: (item) => (
          <div>{formatDate({ date: item.startedAt, format: 'Pp' })}</div>
        ),
        label: t('web_hosting_common_creation_date'),
        isSortable: true,
      },
      {
        id: 'updatedAt',
        cell: (item) => (
          <div>{formatDate({ date: item.updatedAt, format: 'Pp' })}</div>
        ),
        label: t('web_hosting_common_update_date'),
        isSortable: true,
      },
    ],
    [t],
  );
  const handleRefreshClick = () => {
    refetch();
  };
  return (
    <>
      <div className="mb-4 mt-4">
        <OdsButton
          onClick={() => handleRefreshClick()}
          data-testid="refresh"
          label={t('web_hosting_action_refresh')}
          icon={ODS_ICON_NAME.refresh}
          variant={ODS_BUTTON_VARIANT.outline}
          isLoading={isFetching}
        ></OdsButton>
      </div>
      <Datagrid
        columns={columns}
        items={data || []}
        totalItems={data?.length || 0}
      />
    </>
  );
}
