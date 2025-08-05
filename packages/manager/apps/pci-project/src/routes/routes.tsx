import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing'));
const RemovePage = lazy(() => import('@/pages/remove/Remove.page'));
const MainPage = lazy(() => import('@/pages/home/Header.page'));
const HomePage = lazy(() => import('@/pages/home/Home.page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));
const CreationPage = lazy(() => import('@/pages/creation/Creation.page'));
const CreatingPage = lazy(() => import('@/pages/creating/Creating.page'));
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
            pageName: 'remove',
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
          pageType: PageType.funnel,
        },
      }}
    />
    <Route path={urls.project} Component={MainPage}>
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
            pageName: 'edit',
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
      Component={CreationPage}
      handle={{
        tracking: {
          pageName: 'new',
          pageType: PageType.dashboard,
        },
      }}
    />
  </Route>
);
