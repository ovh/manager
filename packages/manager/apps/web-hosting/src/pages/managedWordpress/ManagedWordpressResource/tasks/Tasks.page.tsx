//@todo to analyse for step 2 for import when the customer quit the page before the step 2
import { /* useCallback, */ useMemo } from 'react';

import { /* useNavigate, */ useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Badge, Button, ICON_NAME, Icon, ProgressBar } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  // ActionMenu,
  Datagrid,
  DatagridColumn,
  useFormatDate,
} from '@ovh-ux/muk';

import { useManagedWordpressResourceTasks } from '@/data/hooks/managedWordpress/managedWordpressResourceTasks/useManagedWordpressResourceTasks';
import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressResourceTask } from '@/data/types/product/managedWordpress/tasks';
import { Status } from '@/data/types/product/ssl';
// import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { getStatusColor } from '@/utils/getStatusColor';

export default function TasksPage() {
  const { serviceName } = useParams();
  const { t } = useTranslation(['common', NAMESPACES.DASHBOARD]);

  const { data, refetch, isFetching } = useManagedWordpressResourceTasks(serviceName);
  const formatDate = useFormatDate();
  const { data: websitesList } = useManagedWordpressWebsites();

  /*   const navigate = useNavigate();
  const goToStep2 = useGenerateUrl(`../import`, 'path');

  const handleResumeImport = useCallback(
    (item: ManagedWordpressResourceTask) => {
      const match = item.link.match(/\/website\/([^/]+)/);
      const websiteId = match ? match[1] : null;

      if (!websiteId) return;

      navigate(goToStep2, { state: { websiteId, step: 2 } });
    },
    [navigate, goToStep2],
  ); */

  const getResource = (row: unknown): ManagedWordpressResourceTask => {
    return row as ManagedWordpressResourceTask;
  };
  const columns: DatagridColumn<ManagedWordpressResourceTask>[] = useMemo(
    () => [
      {
        id: 'defaultFqdn',
        accessorFn: (row) => getResource(row).link,
        cell: ({ row }) => {
          const id = getResource(row.original)?.link?.split('/').pop();

          const matchingItem = websitesList?.find((website) => website.id === id);

          return <>{matchingItem?.currentState?.defaultFQDN}</>;
        },
        label: t('web_hosting_status_header_fqdn'),
      },
      {
        id: 'type',
        accessorFn: (row) => getResource(row)?.type,
        cell: ({ row }) => {
          return (
            <span>
              {t(
                `common:web_hosting_common_type_${getResource(row.original)?.type?.toLowerCase()}`,
              )}
            </span>
          );
        },
        header: t(`${NAMESPACES.DASHBOARD}:type`),
      },
      {
        id: 'status',
        accessorFn: (row) => getResource(row)?.status,
        cell: ({ row }) => {
          const statusColor = getStatusColor(getResource(row.original)?.status);
          return (
            <Badge color={statusColor}>
              {t(`web_hosting_status_${getResource(row.original)?.status?.toLocaleLowerCase()}`)}
            </Badge>
          );
        },
        header: t('web_hosting_header_status'),
      },
      {
        id: 'progress',
        accessorFn: (row) => getResource(row)?.message,
        cell: ({ row }) => {
          let progress =
            parseInt(getResource(row.original)?.message?.replace(/\D/g, '') || '', 10) || 0;

          if (getResource(row.original)?.status === Status.DONE) {
            progress = 100;
          }
          console.log(getResource(row.original)?.message, progress);
          return (
            <div>
              <ProgressBar max={100} value={progress} className="mr-4" />
              {progress}%
            </div>
          );
        },
        header: t('web_hosting_header_progress'),
      },
      {
        id: 'comments',
        accessorFn: (row) => getResource(row)?.message,

        cell: ({ row }) => (
          <div>{getResource(row.original)?.message?.replace(/\d+%?/g, '').trim() || ''}</div>
        ),
        header: t('web_hosting_header_comments'),
        isSortable: true,
      },
      {
        id: 'createdAt',
        accessorFn: (row) => getResource(row)?.createdAt,
        cell: ({ row }) => (
          <div>{formatDate({ date: getResource(row.original)?.createdAt, format: 'Pp' })}</div>
        ),
        header: t('web_hosting_common_creation_date'),
        isSortable: true,
      },
      {
        id: 'updatedAt',
        accessorFn: (row) => getResource(row)?.updatedAt,
        cell: ({ row }) => (
          <div>{formatDate({ date: getResource(row.original)?.updatedAt, format: 'Pp' })}</div>
        ),
        header: t('web_hosting_common_update_date'),
        isSortable: true,
      },
      /*  {
        id: 'actions',
        cell: ({ row }) => {
          if (getResource(row).status === Status.WAITING_USER_INPUT) {
            return (
              <ActionMenu
                items={[
                  {
                    id: 1,
                    label: t('common:action_user_import'),
                    onClick: () => handleResumeImport(getResource(row)),
                  },
                ]}
                isCompact
                variant={BUTTON_VARIANT.ghost}
                id={getResource(row).id}
              />
            );
          }
        },
        label: '',
      }, */
    ],
    [t, formatDate, websitesList /* , handleResumeImport */],
  );
  const handleRefreshClick = () => {
    void refetch();
  };
  return (
    <>
      <div className="mb-4 mt-4 flex justify-end">
        <Button
          onClick={() => handleRefreshClick()}
          data-testid="refresh"
          variant={BUTTON_VARIANT.outline}
          loading={isFetching}
        >
          <Icon name={ICON_NAME.refresh}></Icon>
        </Button>
      </div>
      <Datagrid columns={columns} data={data || []} totalCount={data?.length || 0} />
    </>
  );
}
