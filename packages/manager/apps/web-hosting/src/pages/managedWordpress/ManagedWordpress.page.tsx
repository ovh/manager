import { useEffect, useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Badge, BaseLayout, Datagrid, DatagridColumn, Link } from '@ovh-ux/muk';

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

  const onBoardingUrl = useGenerateUrl(`/managed-hosting-for-wordpress/onboarding`, 'path');

  const shouldRedirect = !isLoading && data?.length <= 1;

  useEffect(() => {
    if (shouldRedirect) {
      navigate(data?.length ? firstItemUrl : onBoardingUrl);
    }
  }, [shouldRedirect, navigate, firstItemUrl]);

  const getResource = (row: Record<string, unknown>): ManagedWordpressResourceType => {
    return row as ManagedWordpressResourceType;
  };

  function ResourceLink({ id }: { id: string }) {
    const href = useGenerateUrl(`./${id}`, 'href');
    return <Link href={href}>{id}</Link>;
  }

  const columns: DatagridColumn<ManagedWordpressResourceType>[] = useMemo(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        cell: ({ getValue }) => <ResourceLink id={getValue<string>()} />,
        header: t('common:web_hosting_status_header_resource'),
      },
      {
        id: 'plan',
        accessorKey: 'currentState.quotas.websites.totalQuota',
        cell: ({ getValue }) => {
          const numberOfSites = getValue<string>() || '';
          return <span>{`${numberOfSites} ${t('common:web_hosting_sites')}`}</span>;
        },
        header: t('common:web_hosting_status_header_offer'),
      },
      {
        id: 'resourceStatus',
        cell: ({ row }) => {
          const resource = getResource(row.original);
          const status = resource.resourceStatus ?? '';
          const statusColor = getStatusColor(resource.resourceStatus);
          return (
            <Badge color={statusColor}>
              {t(`common:web_hosting_status_${status.toLowerCase()}`)}
            </Badge>
          );
        },
        header: t(`${NAMESPACES.STATUS}:status`),
      },
      {
        id: 'quota',
        accessorFn: (row) => row.currentState?.quotas?.websites,
        cell: ({ row }) => {
          const resource = getResource(row.original);
          const quota = resource.currentState?.quotas?.websites;
          return (
            <span>
              {quota?.totalUsage ?? 0}&nbsp;/&nbsp;
              {quota?.totalQuota ?? 0}
            </span>
          );
        },
        header: t('common:web_hosting_status_header_websites_installed'),
      },
    ],
    [t],
  );

  if (shouldRedirect) {
    return null;
  }

  return (
    <>
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={{
          title: t('common:managed_wordpress'),
        }}
      >
        <Datagrid
          containerHeight={700}
          isLoading={isLoading}
          columns={data ? columns : []}
          data={data ?? []}
        />
      </BaseLayout>
      <Outlet />
    </>
  );
}
