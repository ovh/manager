import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import {
  CREATE,
  DELETE,
  GENERAL_INFORMATION,
  IMPORT,
  TASKS,
  WORDPRESS_MANAGED,
  WORDPRESS_MANAGED_SERVICE,
} from '@/Tracking.constants';
import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, urls } from './Routes.constants';
import {
  ManagedWordpressPage,
  ManagedWordpressResourcePage,
  ManagedWordpressServiceCreatePage,
  ManagedWordpressServiceDelete,
  ManagedWordpressServiceGeneralInformationPage,
  ManagedWordpressServiceImportPage,
  ManagedWordpressServiceTasksPage,
} from './pages/managedWordpress';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

export default (
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
    <Route
      id={WORDPRESS_MANAGED}
      path={urls.managedWordpress}
      Component={ManagedWordpressPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'managed_wordpress',
        },
      }}
    />

    <Route
      id={WORDPRESS_MANAGED_SERVICE}
      path={urls.managedWordpressResource}
      Component={ManagedWordpressResourcePage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: ':serviceName',
        },
      }}
    >
      <Route
        id={GENERAL_INFORMATION}
        path={urls.managedWordpressResource}
        Component={ManagedWordpressServiceGeneralInformationPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          id={DELETE}
          path={urls.managedWordpressResourceDeleteModal}
          Component={ManagedWordpressServiceDelete}
          handle={{
            tracking: {
              pageName: DELETE,
              pageType: PageType.popup,
            },
          }}
        />
      </Route>

      <Route
        id={TASKS}
        path={urls.managedWordpressResourceTasks}
        Component={ManagedWordpressServiceTasksPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:web_hosting_header_tasks',
          },
        }}
      />
      <Route
        id={CREATE}
        path={urls.managedWordpressResourceCreate}
        Component={ManagedWordpressServiceCreatePage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:create_website',
          },
          isOverridePage: true,
        }}
      />
      <Route
        id={IMPORT}
        path={urls.managedWordpressResourceImport}
        Component={ManagedWordpressServiceImportPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:import_website',
          },
          isOverridePage: true,
        }}
      />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Route>
);
