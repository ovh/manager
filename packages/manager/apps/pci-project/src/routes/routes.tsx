import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';
import CreationGuard from '@/components/creation-guard/CreationGuard';
import ActivationGuard from '@/components/activation-guard/ActivationGuard';

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing'));
const RemovePage = lazy(() => import('@/pages/remove/Remove.page'));
const ProjectDetailPage = lazy(() => import('@/pages/detail/Detail.page'));
const MainPage = lazy(() => import('@/pages/home/Header.page'));
const HomePage = lazy(() => import('@/pages/home/Home.page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));
const CreatingPage = lazy(() => import('@/pages/creating/Creating.page'));
const UpdatingPage = lazy(() => import('@/pages/updating/Updating.page'));
const IncreaseQuotaPage = lazy(() =>
  import('@/pages/increase-quota/IncreaseQuota'),
);
const EditPage = lazy(() => import('@/pages/home/edit/Edit.page'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="pci-project"
      />
    }
  >
    <Route
      path={urls.listing}
      Component={ListingPage}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.LISTING.PAGE_NAME,
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        path={urls.remove}
        Component={RemovePage}
        handle={{
          tracking: {
            pageName: PROJECTS_TRACKING.DELETE.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route
      path={urls.creating}
      Component={CreatingPage}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.CREATING.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      path={urls.creatingWithVoucher}
      Component={CreatingPage}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.CREATING.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      path={urls.updating}
      Component={UpdatingPage}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.UPDATING.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      path={urls.updatingWithVoucher}
      Component={UpdatingPage}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.UPDATING.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    />
    <Route path={urls.project} Component={ProjectDetailPage}>
      <Route path="" Component={MainPage}>
        <Route
          path={urls.home}
          Component={HomePage}
          handle={{
            tracking: {
              pageName: PROJECTS_TRACKING.PROJECT_HOME.PAGE_NAME,
              pageType: PageType.onboarding,
            },
          }}
        />
        <Route
          path={urls.edit}
          Component={EditPage}
          handle={{
            tracking: {
              pageName: PROJECTS_TRACKING.SETTINGS.PAGE_NAME,
              pageType: PageType.dashboard,
            },
          }}
        >
          <Route
            path={urls.remove}
            Component={RemovePage}
            handle={{
              tracking: {
                pageName: PROJECTS_TRACKING.DELETE.PAGE_NAME,
                pageType: PageType.popup,
              },
            }}
          />
        </Route>
      </Route>
      <Route
        path={urls.activate}
        Component={ActivationGuard}
        handle={{
          tracking: {
            pageName: PROJECTS_TRACKING.ACTIVATE.PAGE_NAME,
            pageType: PageType.dashboard,
          },
        }}
      />
    </Route>
    <Route
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.ONBOARDING.PAGE_NAME,
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route
      path={urls.creation}
      Component={CreationGuard}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.CREATION.PAGE_NAME,
          pageType: PageType.dashboard,
        },
      }}
    />
    <Route
      path={urls.increaseQuota}
      Component={IncreaseQuotaPage}
      handle={{
        tracking: {
          pageName: 'increase-quota',
          pageType: PageType.dashboard,
        },
      }}
    />
  </Route>
);
