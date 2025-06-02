import { ApiError } from '@ovh-ux/manager-core-api';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  ErrorBanner,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { Suspense, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useMatch, useParams, useRouteError } from 'react-router-dom';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import { ROUTE_PATHS } from '@/routes';

export default function Layout() {
  const { isSuccess } = useProject();

  const { t } = useTranslation(['regions', 'quotas']);
  const hrefProject = useProjectUrl('public-cloud');
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);

  const quotasMatch = useMatch({
    path: `${ROUTE_PATHS.ROOT}/${ROUTE_PATHS.QUOTA}/*`,
    end: false,
  });

  const isQuotasTab = Boolean(quotasMatch);

  return (
    <div className="application">
      <Suspense>
        <ShellRoutingSync />
        {isSuccess && (
          <>
            <HidePreloader />
            <BaseLayout
              breadcrumb={
                <OdsBreadcrumb>
                  <OdsBreadcrumbItem
                    href={hrefProject}
                    label={project?.description}
                  />
                  <OdsBreadcrumbItem
                    label={
                      isQuotasTab
                        ? t('pci_projects_project_quota', { ns: 'quotas' })
                        : t('pci_projects_project_regions', { ns: 'regions' })
                    }
                    href={''}
                  />
                </OdsBreadcrumb>
              }
              header={{
                headerButton: <PciGuidesHeader category="instances" />,
              }}
            >
              <Outlet />
            </BaseLayout>
          </>
        )}
      </Suspense>
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError() as ApiError;
  const nav = useContext(ShellContext).shell.navigation;

  const redirectionApplication = 'public-cloud';

  const navigateToHomePage = () => {
    nav.navigateTo(redirectionApplication, '', {});
  };

  const reloadPage = () => {
    nav.reload();
  };
  return (
    <Suspense>
      <ErrorBanner
        onReloadPage={reloadPage}
        onRedirectHome={navigateToHomePage}
        error={error.response}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
