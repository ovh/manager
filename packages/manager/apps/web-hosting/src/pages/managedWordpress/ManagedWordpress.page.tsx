import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  Links,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useManagedWordpressResource } from '@/data/hooks/managedWordpressResource/useManagedWordpressResource';
import { ManagedWordpressResourceType } from '@/data/type';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { getStatusColor } from '@/utils/getStatusColor';

export default function ManagedWordpressPage() {
  const { data, isLoading } = useManagedWordpressResource();
  const { t } = useTranslation([
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
  ]);
  const navigate = useNavigate();

  const firstItemUrl = useGenerateUrl(
    `/managed-hosting-for-wordpress/${data?.[0]?.id ?? ''}`,
    'path',
  );

  useEffect(() => {
    if (!isLoading && data?.length === 1) {
      navigate(firstItemUrl);
    }
  }, [data, isLoading, navigate, firstItemUrl]);

  const columns: DatagridColumn<ManagedWordpressResourceType>[] = useMemo(
    () => [
      {
        id: 'id',
        cell: (item) => {
          const href = useGenerateUrl(`./${item.id}`, 'href');
          return <Links href={href} label={item.id} />;
        },
        label: t('common:web_hosting_status_header_resource'),
      },
      {
        id: 'plan',
        cell: (item) => {
          const match = item.currentState.plan.match(/managed-cms-(\d+)/);
          const numberOfSites = match ? match[1] : '?';
          return (
            <span>{`${numberOfSites} ${t('common:web_hosting_sites')}`}</span>
          );
        },
        label: t('common:web_hosting_status_header_offer'),
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
      },
    ],
    [t],
  );

  return (
    <>
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={{
          title: t('common:managed_wordpress'),
        }}
      >
        <Datagrid
          isLoading={isLoading}
          columns={columns}
          items={data || []}
          totalItems={data?.length || 0}
        />
      </BaseLayout>
      <Outlet />
    </>
  );
}
