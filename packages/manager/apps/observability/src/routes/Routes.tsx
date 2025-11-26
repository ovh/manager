import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subroutes, urls } from './Routes.constants';
import { DeleteTenantModal, TenantsPage } from './lazy-parallel/tenants/listing.lazy';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

const DashboardsPage = React.lazy(() => import('@/pages/dashboards/Dashboards.page'));

const TenantsLayoutPage = React.lazy(() => import('@/pages/tenants/Tenants.layout'));

const OnboardingTenantPage = React.lazy(() => import('@/pages/tenants/TenantsOnboarding.page'));
const TenantsCreationPage = React.lazy(() => import('@/pages/tenants/TenantsCreation.page'));
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
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      {/* Default landing inside root → redirect to Dashboards */}
      <Route index element={<Navigate to={urls.dashboards} replace />} />

      {/* Dashboards route */}
      <Route
        path={subroutes.dashboards}
        Component={DashboardsPage}
        handle={{
          tracking: {
            pageName: 'dashboards',
          },
        }}
      />

      {/* Metrics route */}
      <Route path={subroutes.metrics} Component={TenantsLayoutPage}>
        {/* Default landing inside root → redirect to tenants */}
        <Route index element={<Navigate to={urls.tenants} replace />} />
        {/* Onboarding observability service */}
        <Route
          path={subroutes.onboarding}
          Component={OnboardingServicePage}
          handle={{
            tracking: {
              pageName: 'onboarding',
            },
          }}
        />
        {/* Tenants routes */}
        <Route path={subroutes.tenants}>
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
            <Route
              path={`${subroutes.edit}`}
              Component={EditTenantPage}
              handle={{
                tracking: {
                  pageName: 'tenant-edit',
                  pageType: PageType.popup,
                },
              }}
            />
          </Route>
          <Route
            path={subroutes.onboarding}
            Component={OnboardingTenantPage}
            handle={{
              tracking: {
                pageName: 'tenants-onboarding',
              },
            }}
          />
          <Route
            path={subroutes.creation}
            Component={TenantsCreationPage}
            handle={{
              tracking: {
                pageName: 'tenants-creation',
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
