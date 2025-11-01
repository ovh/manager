import { useEffect, useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Badge } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, Datagrid, DatagridColumn, Link } from '@ovh-ux/muk';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useManagedWordpressResource } from '@/data/hooks/managedWordpress/managedWordpressResource/useManagedWordpressResource';
import { ManagedWordpressResourceType } from '@/data/types/product/managedWordpress/ressource';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { getStatusColor } from '@/utils/getStatusColor';

export default function ManagedWordpressPage() {
  const { data, isLoading } = useManagedWordpressResource();
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS, NAMESPACES.STATUS]);
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

  function ResourceLink({ id }: { id: string }) {
    const href = useGenerateUrl(`./${id}`, 'href');
    return <Link href={href} label={id} />;
  }

  const getResource = (row: Record<string, unknown>): ManagedWordpressResourceType => {
    return row as ManagedWordpressResourceType;
  };

  const columns: DatagridColumn<Record<string, unknown>>[] = useMemo(
    () => [
      {
        id: 'id',
        accessorFn: (row) => getResource(row).id,
        cell: ({ row }) => <ResourceLink id={getResource(row.original).id} />,
        label: t('common:web_hosting_status_header_resource'),
      },
      {
        id: 'plan',
        accessorFn: (row) => getResource(row).currentState?.plan,
        cell: ({ row }) => {
          const resource = getResource(row.original);
          const plan = resource.currentState?.plan ?? '';
          const match = plan.match(/managed-cms-alpha-(\d+)/);
          const numberOfSites = match ? match[1] : '?';
          return <span>{`${numberOfSites} ${t('common:web_hosting_sites')}`}</span>;
        },
        label: t('common:web_hosting_status_header_offer'),
      },
      {
        id: 'resourceStatus',
        accessorFn: (row) => getResource(row).resourceStatus,
        cell: ({ row }) => {
          const resource = getResource(row.original);
          const status = resource.resourceStatus ?? '';
          const statusColor = getStatusColor(resource.resourceStatus);
          return (
            <Badge color={statusColor}>
              {t(`common:web_hosting_status_${status.toLocaleLowerCase()}`)}
            </Badge>
          );
        },
        label: t(`${NAMESPACES.STATUS}:status`),
      },
      {
        id: 'quota',
        accessorFn: (row) => getResource(row).currentState?.quotas?.websites,
        cell: ({ row }) => {
          const resource = getResource(row.original);
          return (
            <span>
              {resource.currentState?.quotas?.websites?.totalUsage}&nbsp;/&nbsp;
              {resource.currentState?.quotas?.websites?.totalQuota}
            </span>
          );
        },
        label: t('common:web_hosting_status_header_websites_installed'),
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
          data={data || []}
          totalCount={data?.length || 0}
        />
      </BaseLayout>
      <Outlet />
    </>
  );
}
