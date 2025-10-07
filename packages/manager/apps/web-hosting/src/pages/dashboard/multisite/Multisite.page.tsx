import { useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Datagrid, DatagridColumn, ManagerButton } from '@ovh-ux/manager-react-components';

import { useOverridePage } from '@/hooks/overridePage/useOverridePage';
import { subRoutes, urls } from '@/routes/routes.constants';

import ActionButtonMultisite from './component/ActionButtonMultisite.component';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};
export default function MultisitePage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('common');
  const isOverridedPage = useOverridePage();
  const navigate = useNavigate();
  const items = [
    {
      site: serviceName,
      domain: 'test.site',
      path: 'testsuppression',
    },
  ];
  const columns: DatagridColumn<(typeof items)[0]>[] = useMemo(
    () => [
      {
        id: 'site',
        label: 'Site',
        isSortable: true,
        cell: (row) => <div>{row.site}</div>,
      },
      {
        id: 'domain',
        label: 'Domaine',
        isSortable: true,
        cell: (row) => <div>{row.domain}</div>,
      },
      {
        id: 'cms',
        label: 'Cms',
        isSortable: true,
        cell: (row) => <div>{row.site}</div>,
      },
      {
        id: 'path',
        label: 'Répertoire',
        isSortable: true,
        cell: (row) => <div>{row.path}</div>,
      },
      {
        id: 'git',
        label: 'Git',
        isSortable: true,
        cell: (row) => <div>{row.site}</div>,
      },
      {
        id: 'action',
        label: '',
        isSortable: true,
        cell: (row) => (
          <ActionButtonMultisite
            site={row.site}
            domain={row.domain}
            //cms={row.cms}
            path={row.path}
            //git={row.git}
          />
        ),
      },
    ],
    [],
  );
  return (
    <>
      {!isOverridedPage && (
        <Datagrid
          columns={columns}
          items={items || []}
          totalItems={0}
          topbar={
            <ManagerButton
              id={''}
              label={t('add_website')}
              onClick={() => navigate(urls.addWebSite.replace(subRoutes.serviceName, serviceName))}
            />
          }
        />
      )}
      <Outlet />
    </>
  );
}
