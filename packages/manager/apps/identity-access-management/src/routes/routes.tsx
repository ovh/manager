import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import TagDetail from '@/pages/tagManager/tagDetail/TagDetail.page';

const LayoutPage = lazy(() => import('@/pages/layout'));
const TagManager = lazy(() => import('@/pages/tagManager/TagManager.page'));
const AssignTag = lazy(() =>
  import('@/pages/tagManager/assignTag/AssignTag.page'),
);

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="identity-access-management"
      />
    }
  >
    <Route
      path={urls.root}
      element={<Navigate to={urls.tagManager} replace />}
    />
    <Route
      path={urls.tagManager}
      Component={TagManager}
      handle={{
        tracking: {
          pageName: 'tag-manager',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={urls.assignTag}
      Component={AssignTag}
      handle={{
        tracking: {
          pageName: 'assign-tag',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={urls.tagDetail}
      Component={TagDetail}
      handle={{
        tracking: {
          pageName: 'tag',
          pageType: PageType.listing,
        },
      }}
    />
  </Route>
);
