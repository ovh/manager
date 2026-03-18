import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/404.page';
import { redirectionApp, subroutes, urls } from '@/routes/Routes.constants';
import { DeleteTenantModal, TenantsPage } from '@/routes/lazy-parallel/tenants/listing.lazy';

const MainLayout = React.lazy(() => import('@/pages/Main.layout'));

const TenantsLayout = React.lazy(() => import('@/pages/tenants/Tenants.layout'));
const TenantsBaseLayout = React.lazy(() => import('@/pages/tenants/TenantsBase.layout'));
const TenantLayout = React.lazy(() => import('@/pages/tenants/Tenant.layout'));
const ObservabilityServiceLayout = React.lazy(
  () => import('@/contexts/ObservabilityService.layout'),
);
const ServicesBaseLayout = React.lazy(
  () => import('@/pages/settings/services/ServicesBase.layout'),
);
const OnboardingServiceLayout = React.lazy(
  () => import('@/pages/settings/services/onboarding/OnboardingService.layout'),
);
const ManagedDashboardsLayout = React.lazy(
  () => import('@/pages/settings/managed-dashboards/ManagedDashboards.layout'),
);
const OnboardingManagedDashboardsLayout = React.lazy(
  () => import('@/pages/settings/managed-dashboards/onboarding/OnboardingManagedDashboards.layout'),
);
const OnboardingManagedDashboardsPage = React.lazy(
  () => import('@/pages/settings/managed-dashboards/onboarding/OnboardingManagedDashboards.page'),
);
const ManagedDashboardsListingPage = React.lazy(
  () => import('@/pages/settings/managed-dashboards/listing/ManagedDashboardsListing.page'),
);
const ManagedDashboardLayoutPage = React.lazy(
  () => import('@/pages/settings/managed-dashboards/[resource]/ManagedDashboard.layout'),
);
const ManagedDashboardCreationPage = React.lazy(
  () => import('@/pages/settings/managed-dashboards/[resource]/ManagedDashboardCreation.page'),
);
const EditManagedDashboardPage = React.lazy(
  () => import('@/pages/settings/managed-dashboards/[resource]/edit/ManagedDashboardEdit.page'),
);
const ManagedDashboardDeletePage = React.lazy(
  () => import('@/pages/settings/managed-dashboards/[resource]/delete/ManagedDashboardDelete.page'),
);

const OnboardingTenantPage = React.lazy(() => import('@/pages/tenants/TenantsOnboarding.page'));
const TenantsCreationPage = React.lazy(() => import('@/pages/tenants/TenantCreation.page'));
const EditTenantPage = React.lazy(() => import('@/pages/tenants/edit/EditTenant.page'));
const OnboardingServicePage = React.lazy(
  () => import('@/pages/settings/services/onboarding/OnboardingService.page'),
);
const ServicesPage = React.lazy(() => import('@/pages/settings/services/Services.page'));
const ServiceDeletePage = React.lazy(
  () => import('@/pages/settings/services/delete/ServiceDelete.page'),
);
const ServiceEditPage = React.lazy(() => import('@/pages/settings/services/edit/ServiceEdit.page'));
const TenantDashboardPage = React.lazy(
  () => import('@/pages/tenants/dashboard/TenantDashboard.page'),
);
const TenantGeneralInformationPage = React.lazy(
  () => import('@/pages/tenants/dashboard/general-information/TenantInformation.page'),
);
const TenantSubscriptionPage = React.lazy(
  () => import('@/pages/tenants/dashboard/subscription/TenantSubscription.page'),
);
const DeleteTenantSubscriptionPage = React.lazy(
  () => import('@/pages/tenants/dashboard/subscription/DeleteTenantSubscription.page'),
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
      <Route path={subroutes.settings} Component={OnboardingServiceLayout}>
        <Route path={subroutes.services}>
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
      </Route>

      <Route Component={ObservabilityServiceLayout}>
        {/* Settings route */}
        <Route path={subroutes.settings}>
          <Route index element={<Navigate to={urls.services} replace />} />
          <Route path={subroutes.services} Component={ServicesBaseLayout}>
            <Route path="" Component={ServicesPage}>
              <Route
                path={subroutes.delete}
                Component={ServiceDeletePage}
                handle={{
                  tracking: {
                    pageName: 'service-delete',
                    pageType: PageType.popup,
                  },
                }}
              />
              <Route
                path={subroutes.edit}
                Component={ServiceEditPage}
                handle={{
                  tracking: {
                    pageName: 'service-edit',
                    pageType: PageType.popup,
                  },
                }}
              />
            </Route>
          </Route>
          {/* ManagedDashboard routes with default layout*/}
          <Route path={subroutes.managedDashboards} Component={OnboardingManagedDashboardsLayout}>
            <Route
              path={subroutes.onboarding}
              Component={OnboardingManagedDashboardsPage}
              handle={{
                tracking: {
                  pageName: 'managed-dashboards-onboarding',
                },
              }}
            />
          </Route>
          {/* ManagedDashboard routes with ManagedDashboard layout*/}
          <Route path={subroutes.managedDashboards} Component={ManagedDashboardsLayout}>
            <Route path="" Component={ManagedDashboardsListingPage}>
              <Route
                path={subroutes.deleteManagedDashboard}
                Component={ManagedDashboardDeletePage}
                handle={{
                  tracking: {
                    pageName: 'managed-dashboard-delete',
                    pageType: PageType.popup,
                  },
                }}
              />
            </Route>
          </Route>
          {/* ManagedDashboard routes with ManagedDashboard layout*/}
          <Route path={subroutes.managedDashboards} Component={ManagedDashboardLayoutPage}>
            <Route path={subroutes.resource}>
              {/* no dedicated page (only a dropdown) → redirect to managed dashboards */}
              <Route index element={<Navigate to={urls.managedDashboards} replace />} />
              <Route
                path={subroutes.creation}
                Component={ManagedDashboardCreationPage}
                handle={{
                  titleKey: 'creation.title',
                  tracking: {
                    pageName: 'managed-dashboard-create',
                  },
                }}
              />
              <Route
                path={`${subroutes.managedDashboard}/${subroutes.edit}`}
                Component={EditManagedDashboardPage}
                handle={{
                  titleKey: 'edition.title',
                  tracking: {
                    pageName: 'managed-dashboard-edit',
                  },
                }}
              />
            </Route>
          </Route>
        </Route>
        {/* Metrics route */}
        <Route path={subroutes.metrics}>
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
                path={subroutes.deleteTenant}
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
            <Route path={subroutes.resource}>
              {/* no dedicated page (only a dropdown) → redirect to tenants */}
              <Route index element={<Navigate to={urls.tenants} replace />} />
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
                path={subroutes.tenant}
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
                  path={subroutes.edit}
                  Component={EditTenantPage}
                  handle={{
                    titleKey: 'edition.title',
                    tracking: {
                      pageName: 'tenant-edit',
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
                >
                  <Route
                    path={subroutes.deleteTenantSubscription}
                    Component={DeleteTenantSubscriptionPage}
                    handle={{
                      tracking: {
                        pageName: 'tenant-subscription-delete',
                      },
                    }}
                  />
                </Route>
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
        </Route>
      </Route>

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
