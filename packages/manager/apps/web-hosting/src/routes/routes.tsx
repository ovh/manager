import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Route } from 'react-router-dom';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import { ONBOARDING, WEBSITE } from '@/utils/tracking.constants';

const RootPage = React.lazy(() => import('@/pages/layout'));
const WebsitesPage = React.lazy(() => import('@/pages/websites/Websites.page'));
const OnboardingPage = React.lazy(() =>
  import('@/pages/onboarding/Onboarding.page'),
);

export default (
  <Route
    id={'root'}
    path={urls.root}
    Component={RootPage}
    handle={{
      breadcrumb: {
        icon: ODS_ICON_NAME.home,
      },
    }}
    errorElement={
      <ErrorBoundary
        redirectionApp="web-hosting-backup"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route
      id={WEBSITE}
      path={urls.websites}
      Component={WebsitesPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'websites',
        },
      }}
    />
    <Route
      id={ONBOARDING}
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
