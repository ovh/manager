import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { getListingIcebergV6 } from '@/data/api/dedicated-servers';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constant';

export type ServerInfos = {
  ip: string;
  os: string;
  powerState: 'poweroff' | 'poweron';
  professionalUse: boolean;
  noIntervention: boolean;
  newUpgradeSystem: boolean;
  availabilityZone: string;
  bootId?: number | null;
  bootScript?: string | null;
  commercialRange?: string | null;
  datacenter: string;
  iam: {
    displayName?: string | null;
    id: string;
    urn: string;
  };
  linkSpeed?: number | null;
  monitoring: boolean;
  name: string;
  rack: string;
  region: string;
  rescueMail?: string | null;
  rescurSshKey?: string | null;
  reverse?: string | null;
  rootDevice?: string | null;
  serverId: number;
  state: 'error' | 'hacked' | 'hackedBlocked' | 'ok';
  supportLevel: 'critical' | 'fastpath' | 'gs' | 'pro';
};

export default function Listing() {
  const { shell } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();
  const { pageIndex, pageSize } = pagination;
  const { t } = useTranslation('listing');

  const { data, isError, error, isLoading } = useQuery({
    queryKey: [`servicesListingIceberg-${pageIndex + 1}-${pageSize}`],
    queryFn: () =>
      getListingIcebergV6<ServerInfos>({ pageSize, page: pageIndex + 1 }),
    retry: false,
    staleTime: Infinity,
  });

  const columns: DatagridColumn<ServerInfos>[] = [
    {
      id: 'displayName',
      label: t('displayName'),
      isSortable: true,
      cell: (infos) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() =>
              shell.navigation.navigateTo(
                'dedicated',
                `#/server/${infos.name}`,
                {},
              )
            }
          >
            {infos?.iam?.displayName}
          </OsdsLink>
        </DataGridTextCell>
      ),
    },
    {
      id: 'ip',
      label: t('ip'),
      isSortable: true,
      cell: (infos) => <DataGridTextCell>{infos.ip}</DataGridTextCell>,
    },
    {
      id: 'commercialRange',
      label: t('commercialRange'),
      isSortable: true,
      cell: (infos) => (
        <DataGridTextCell>{infos.commercialRange}</DataGridTextCell>
      ),
    },
    {
      id: 'region',
      label: t('region'),
      isSortable: true,
      cell: (infos) => <DataGridTextCell>{infos.region}</DataGridTextCell>,
    },
    {
      id: 'state',
      label: t('state'),
      isSortable: true,
      cell: (infos) => <DataGridTextCell>{infos.state}</DataGridTextCell>,
    },
    {
      id: 'actions',
      label: ((
        <OsdsIcon name={ODS_ICON_NAME.SETTINGS} size={ODS_ICON_SIZE.xxs} />
      ) as unknown) as string,
      isSortable: false,
      cell: () => (
        <OsdsIcon name={ODS_ICON_NAME.ELLIPSIS} size={ODS_ICON_SIZE.md} />
      ),
    },
  ];

  if (isError) {
    return <ErrorBanner error={error} />;
  }

  if (isLoading && pageIndex === 0) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (data?.data.length === 0) {
    return navigate(urls.onboarding);
  }

  Promise.all(
    data?.data.map((s) =>
      shell.navigation.getURL('dedicated', `/server/${s.name}`, {}),
    ),
  ).then((result) => console.log(result));

  return (
    <>
      <div className="pt-5 pb-10">
        <Breadcrumb />
        <h2>dedicated-servers</h2>
        <React.Suspense>
          <div>{t('title')}</div>
          {columns && (
            <Datagrid
              columns={columns}
              items={data?.data || []}
              totalItems={data?.totalCount || 0}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortChange={setSorting}
            />
          )}
        </React.Suspense>
      </div>
    </>
  );
}
