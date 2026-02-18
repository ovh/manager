//@todo to analyse for step 2 for import when the customer quit the page before the step 2
import { /* useCallback, */ useCallback, useMemo } from 'react';

import { /* useNavigate, */ useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button, ICON_NAME, Icon, ProgressBar } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Badge,
  // ActionMenu,
  Datagrid,
  DatagridColumn,
  useFormatDate,
} from '@ovh-ux/muk';

import { useManagedWordpressResourceTasks } from '@/data/hooks/managedWordpress/managedWordpressResourceTasks/useManagedWordpressResourceTasks';
import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressResourceTask } from '@/data/types/product/managedWordpress/tasks';
import { ManagedWordpressWebsites } from '@/data/types/product/managedWordpress/website';
import { Status } from '@/data/types/product/ssl';
// import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { getStatusColor } from '@/utils/getStatusColor';

export default function TasksPage() {
  const { serviceName } = useParams();
  const { t } = useTranslation(['common', NAMESPACES.DASHBOARD]);

  const { data, refetch, isFetching, isLoading } = useManagedWordpressResourceTasks(serviceName);
  const formatDate = useFormatDate();
  const { data: websitesList } = useManagedWordpressWebsites({
    disableRefetchInterval: true,
  });
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

  const columns: DatagridColumn<ManagedWordpressResourceTask>[] = useMemo(
    () => [
      {
        id: 'defaultFqdn',
        accessorKey: 'link',
        cell: ({ row }) => {
          const id = row?.original?.link?.split('/').pop();
          const matchingItem = (websitesList as unknown as ManagedWordpressWebsites[])?.find(
            (website) => website.id === id,
          );
          return <>{matchingItem?.currentState?.defaultFQDN}</>;
        },
        header: t('web_hosting_status_header_fqdn'),
      },
      {
        id: 'type',
        accessorKey: 'type',
        cell: ({ getValue }) => {
          return (
            <span>{t(`common:web_hosting_common_type_${getValue<string>().toLowerCase()}`)}</span>
          );
        },
        header: t(`${NAMESPACES.DASHBOARD}:type`),
      },
      {
        id: 'status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const statusColor = getStatusColor(getValue<Status>());
          return (
            <Badge color={statusColor}>
              {t(`web_hosting_status_${getValue<Status>().toLocaleLowerCase()}`)}
            </Badge>
          );
        },
        header: t('web_hosting_header_status'),
      },
      {
        id: 'progress',
        cell: ({ row }) => {
          const raw = row.original.message;
          let progress = parseInt(raw.replace(/\D/g, '') || '', 10) || 0;

          if (row.original.status === Status.DONE) {
            progress = 100;
          }
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
        id: 'message',
        accessorKey: 'message',
        cell: ({ getValue }) => <div>{getValue<string>().replace(/\d+%?/g, '').trim() || ''}</div>,
        header: t('web_hosting_header_comments'),
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => <div>{formatDate({ date: getValue<string>(), format: 'Pp' })}</div>,
        header: t('web_hosting_common_creation_date'),
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        cell: ({ getValue }) => <div>{formatDate({ date: getValue<string>(), format: 'Pp' })}</div>,
        header: t('web_hosting_common_update_date'),
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
    [formatDate, t, websitesList],
  );
  const handleRefreshClick = useCallback(() => {
    void refetch();
  }, [refetch]);
  return (
    <>
      <div className="my-4 flex justify-end">
        <Button
          onClick={() => handleRefreshClick()}
          data-testid="refresh"
          variant={BUTTON_VARIANT.outline}
          loading={isFetching}
        >
          <Icon name={ICON_NAME.refresh}></Icon>
        </Button>
      </div>
      <Datagrid columns={data ? columns : []} data={data ?? []} isLoading={isLoading} />
    </>
  );
}
