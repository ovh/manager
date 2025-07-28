import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  Links,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useManagedWordpressResource } from '@/data/hooks/managedWordpressResource/useManagedWordpressResource';
import { ManagedWordpressResourceType } from '@/data/type';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { BadgeStatus } from '@/components/badgeStatus/BadgeStatus.component';

export default function ManagedWordpressPage() {
  const { data, isLoading } = useManagedWordpressResource();
  const { t } = useTranslation([
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
  ]);

  const columns: DatagridColumn<ManagedWordpressResourceType>[] = useMemo(
    () => [
      {
        id: 'id',
        cell: (item) => {
          const href = useGenerateUrl(`./${item.id}`, 'href');

          return <Links href={href} label={item.id}></Links>;
        },
        label: t('common:web_hosting_status_header_resource'),
      },
      {
        id: 'plan',
        cell: (item) => <span>{item.currentState.plan}</span>,
        label: t('common:web_hosting_status_header_offer'),
      },
      {
        id: 'resourceStatus',
        cell: (item) => <BadgeStatus itemStatus={item.resourceStatus} />,
        label: t(`${NAMESPACES.STATUS}:status`),
      },
    ],
    [],
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
