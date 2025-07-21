import { useEffect, Suspense } from 'react';
import { useHref, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsButton } from '@ovhcloud/ods-components/react';
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
  useNotifications,
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
import useRedirectAfterProjectSelection from '@/hooks/useRedirectAfterProjectSelection';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

type ErrorResponse = {
  response?: {
    headers?: Record<string, string>;
    status?: number;
  };
};

export default function Listing() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('listing');
  const projectPath = useHref(`${urls.root}/${urls.project}`);
  const navigate = useNavigate();

  const {
    redirectUrl,
    isRedirectRequired,
  } = useRedirectAfterProjectSelection();
  const { addInfo } = useNotifications();

  const getProjectUrl = async (projectId: string): Promise<string> => {
    if (isRedirectRequired) {
      return redirectUrl(projectId);
    }

    return Promise.resolve(projectPath.replace(':projectId', projectId));
  };

  const columns = getDatagridColumns(t, getProjectUrl);

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

  useEffect(() => {
    if (isRedirectRequired) {
      addInfo(t('pci_projects_redirect_to_dedicated_page'));
    }
  }, [isRedirectRequired, addInfo]);

  if (isError) {
    const { response } = error as ErrorResponse;
    const errorObj = {
      data: error,
      headers: response?.headers,
      status: response?.status,
    };
    return <ErrorBanner error={errorObj} />;
  }

  const header = {
    title: t('pci_projects'),
  };

  const handleCreateProjectClick = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.LISTING.CTA_CREATE_PROJECT,
    });
    navigate(urls.creation);
  };

  const TopBarCTA = (
    <div>
      {!isTrustedZoneLoading && !isTrustedZone && (
        <OdsButton
          data-testid="listing_create-project_button"
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          label={t('pci_projects_create_project')}
          onClick={handleCreateProjectClick}
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

      <Suspense>
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
            topbar={TopBarCTA}
          />
        )}
      </Suspense>

      <Outlet />
    </BaseLayout>
  );
}
