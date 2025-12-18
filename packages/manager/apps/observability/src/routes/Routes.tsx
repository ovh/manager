import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subroutes, urls } from './Routes.constants';
import { DeleteTenantModal, TenantsPage } from './lazy-parallel/tenants/listing.lazy';

const MainLayout = React.lazy(() => import('@/pages/Main.layout'));

const TenantsLayout = React.lazy(() => import('@/pages/tenants/Tenants.layout'));
const TenantsBaseLayout = React.lazy(() => import('@/pages/tenants/TenantsBase.layout'));
const TenantLayout = React.lazy(() => import('@/pages/tenants/Tenant.layout'));
const MetricsLayout = React.lazy(() => import('@/pages/metrics/Metrics.layout'));
const OnboardingServiceLayout = React.lazy(
  () => import('@/pages/metrics/OnboardingService.layout'),
);
const OnboardingTenantPage = React.lazy(() => import('@/pages/tenants/TenantsOnboarding.page'));
const TenantsCreationPage = React.lazy(() => import('@/pages/tenants/TenantCreation.page'));
const EditTenantPage = React.lazy(() => import('@/pages/tenants/edit/EditTenant.page'));
const OnboardingServicePage = React.lazy(() => import('@/pages/metrics/OnboardingService.page'));

const TenantDashboardPage = React.lazy(
  () => import('@/pages/tenants/dashboard/TenantDashboard.page'),
);
const TenantGeneralInformationPage = React.lazy(
  () => import('@/pages/tenants/dashboard/general-information/TenantInformation.page'),
);
const TenantSubscriptionPage = React.lazy(
  () => import('@/pages/tenants/dashboard/subscription/TenantSubscription.page'),
);
const TenantTagsPage = React.lazy(() => import('@/pages/tenants/dashboard/tags/TenantTags.page'));

export default (
  <>
    <Route path="/" element={<Navigate to={urls.root} replace />} />

    {/* Rooted application layout */}
    <Route
      id="root"
      path={urls.root}
      Component={MainLayout}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      {/* Default landing inside root → redirect to Metrics */}
      <Route index element={<Navigate to={urls.metrics} replace />} />

      {/* Onboarding observability service */}
      <Route path={subroutes.metrics} Component={OnboardingServiceLayout}>
        <Route
          path={subroutes.onboarding}
          Component={OnboardingServicePage}
          handle={{
            tracking: {
              pageName: 'onboarding',
            },
          }}
        />
      </Route>

      {/* Metrics route */}
      <Route path={subroutes.metrics} Component={MetricsLayout}>
        {/* Default landing inside root → redirect to tenants */}
        <Route index element={<Navigate to={urls.tenants} replace />} />

        {/* Tenants routes with base layout + tenants description */}
        <Route path={subroutes.tenants} Component={TenantsLayout}>
          <Route
            path=""
            Component={TenantsPage}
            handle={{
              tracking: {
                pageName: 'tenants',
              },
            }}
          >
            <Route
              path={`${subroutes.delete}`}
              Component={DeleteTenantModal}
              handle={{
                tracking: {
                  pageName: 'tenant-delete',
                  pageType: PageType.popup,
                },
              }}
            />
          </Route>
        </Route>
        {/* Tenants routes with default layout*/}
        <Route path={subroutes.tenants} Component={TenantsBaseLayout}>
          <Route
            path={subroutes.onboarding}
            Component={OnboardingTenantPage}
            handle={{
              tracking: {
                pageName: 'tenants-onboarding',
              },
            }}
          />
        </Route>
        {/* Tenant layout */}
        <Route path={subroutes.tenants} Component={TenantLayout}>
          <Route
            path={subroutes.creation}
            Component={TenantsCreationPage}
            handle={{
              titleKey: 'creation.title',
              tracking: {
                pageName: 'tenants-creation',
              },
            }}
          />
          <Route
            path={`${subroutes.edit}`}
            Component={EditTenantPage}
            handle={{
              titleKey: 'edition.title',
              tracking: {
                pageName: 'tenant-edit',
              },
            }}
          />
          <Route
            path={subroutes.dashboard}
            Component={TenantDashboardPage}
            handle={{
              tracking: {
                pageName: 'tenant-dashboard',
              },
            }}
          >
            <Route
              path=""
              Component={TenantGeneralInformationPage}
              handle={{
                tracking: {
                  pageName: 'tenant-general-information-tab',
                },
              }}
            />
            <Route
              path={subroutes.subscription}
              Component={TenantSubscriptionPage}
              handle={{
                tracking: {
                  pageName: 'tenant-subscription-tab',
                },
              }}
            />
            <Route
              path={subroutes.tags}
              Component={TenantTagsPage}
              handle={{
                tracking: {
                  pageName: 'tenant-tags-tab',
                },
              }}
            />
          </Route>
        </Route>
      </Route>

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
