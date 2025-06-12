import React from 'react';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsSpinner } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  ErrorBanner,
  BaseLayout,
  useResourcesV6,
  Notifications,
} from '@ovh-ux/manager-react-components';
import {
  PciTrustedZoneBanner,
  useTrustedZoneBanner,
} from '@ovh-ux/manager-pci-common';
import { getDatagridColumns } from './datagrid-columns';
import {
  getProjectsWithServices,
  projectsWithServiceQueryKey,
} from '@/data/api/projects-with-services';
import ManagerBannerText from '@/components/ManagerBannerText';

type ErrorResponse = {
  response?: {
    headers?: Record<string, string>;
    status?: number;
  };
};

export default function Listing() {
  // const navigate = useNavigate();
  const { t } = useTranslation('listing');

  const columns = getDatagridColumns(t);

  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    sorting,
    setSorting,
    filters,
  } = useResourcesV6({
    columns,
    route: `/cloud/project`,
    queryFn: getProjectsWithServices,
    queryKey: projectsWithServiceQueryKey(),
    defaultSorting: {
      id: 'aggregatedStatus',
      desc: true,
    },
  });

  const {
    isBannerVisible: isTrustedZone,
    isLoading: isTrustedZoneLoading,
  } = useTrustedZoneBanner();

  // const navigateToDashboard = (label: string) => {
  //   const path =
  //     location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
  //   startTransition(() => navigate(`${path}${label}`));
  // };

  if (isError) {
    const { response } = error as ErrorResponse;
    const errorObj = {
      data: error,
      headers: response?.headers,
      status: response?.status,
    };
    return <ErrorBanner error={errorObj} />;
  }

  if (isLoading && !flattenData) {
    return (
      <div
        className="flex justify-center"
        data-testid="listing-spinner-container"
      >
        <OdsSpinner />
      </div>
    );
  }

  const header = {
    title: t('pci_projects'),
  };

  const TopbarCTA = () => (
    <div>
      {!isTrustedZoneLoading && !isTrustedZone && (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          label={t('pci_projects_create_project')}
        />
      )}
    </div>
  );

  return (
    <BaseLayout header={header}>
      <div className="mb-6 flex flex-col items-stretch gap-4">
        <ManagerBannerText />
        <Notifications />
        <PciTrustedZoneBanner />
      </div>

      <React.Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={flattenData || []}
            totalItems={totalCount || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            isLoading={isLoading}
            filters={filters}
            search={search}
            topbar={<TopbarCTA />}
          />
        )}
      </React.Suspense>
    </BaseLayout>
  );
}
