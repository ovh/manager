import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import TagDetail from '@/pages/tagManager/tagDetail/TagDetail.page';
import TagDetailAssign from '@/pages/tagManager/tagDetailAssign/TagDetailAssign.page';
import TagDetailUnassign from '@/pages/tagManager/tagDetailUnassign/TagDetailUnassign.modal';
import {
  TrackPageName,
  PERMANENT_TOKENS_TRACKING,
  SERVICE_ACCOUNTS_TRACKING,
} from '@/tracking.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const TagManager = lazy(() => import('@/pages/tagManager/TagManager.page'));
const AssignTag = lazy(() =>
  import('@/pages/tagManager/assignTag/AssignTag.page'),
);
const PermanentTokensListing = lazy(() =>
  import('@/pages/permanentTokens/listing/PermanentTokensListing.page'),
);
const PermanentTokensEdit = lazy(() =>
  import('@/pages/permanentTokens/edit/PermanentTokensEdit.page'),
);
const PermanentTokensDelete = lazy(() =>
  import('@/pages/permanentTokens/delete/PermanentTokensDelete.page'),
);
const PermanentTokensViewer = lazy(() =>
  import('@/pages/permanentTokens/viewer/PermanentTokensViewer.page'),
);
const ServiceAccountsListing = lazy(() =>
  import('@/pages/serviceAccounts/listing/ServiceAccountsListing.page'),
);
const ServiceAccountsEdit = lazy(() =>
  import('@/pages/serviceAccounts/edit/ServiceAccountsEdit.page'),
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
          pageName: TrackPageName.TAG_MANAGEMENT,
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={urls.assignTag}
      Component={AssignTag}
      handle={{
        tracking: {
          pageName: TrackPageName.TAG_MANAGEMENT_ASSIGN_TAG,
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={urls.tagDetail}
      Component={TagDetail}
      handle={{
        tracking: {
          pageName: TrackPageName.TAG_MANAGEMENT_TAG_DETAIL,
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        path={urls.tagdetailUnassign}
        Component={TagDetailUnassign}
        handle={{
          tracking: {
            pageName: TrackPageName.TAG_MANAGEMENT_UNASSIGN_TAG,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route
      path={urls.tagDetailAssign}
      Component={TagDetailAssign}
      handle={{
        tracking: {
          pageName: 'tag-management_assign-tag',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={urls.permanentTokens}
      Component={PermanentTokensListing}
      handle={{
        tracking: {
          pageName: PERMANENT_TOKENS_TRACKING.LISTING.PAGE_NAME,
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        path={urls.permanentTokensAdd}
        Component={PermanentTokensEdit}
        handle={{
          tracking: {
            pageName: PERMANENT_TOKENS_TRACKING.ADD.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={urls.permanentTokensEdit}
        Component={PermanentTokensEdit}
        handle={{
          tracking: {
            pageName: PERMANENT_TOKENS_TRACKING.EDIT.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={urls.permanentTokensDelete}
        Component={PermanentTokensDelete}
        handle={{
          tracking: {
            pageName: PERMANENT_TOKENS_TRACKING.DELETE.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={urls.permanentTokensView}
        Component={PermanentTokensViewer}
        handle={{
          tracking: {
            pageName: PERMANENT_TOKENS_TRACKING.VIEWER.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route
      path={urls.serviceAccounts}
      Component={ServiceAccountsListing}
      handle={{
        tracking: {
          pageName: SERVICE_ACCOUNTS_TRACKING.LISTING.PAGE_NAME,
          pageType: PageType.listing,
        },
      }}
    ></Route>
    <Route
      path={urls.serviceAccountsAdd}
      Component={ServiceAccountsEdit}
      handle={{
        tracking: {
          pageName: SERVICE_ACCOUNTS_TRACKING.ADD.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    ></Route>
    <Route
      path={urls.serviceAccountsEdit}
      Component={ServiceAccountsEdit}
      handle={{
        tracking: {
          pageName: SERVICE_ACCOUNTS_TRACKING.EDIT.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    ></Route>
  </Route>
);
