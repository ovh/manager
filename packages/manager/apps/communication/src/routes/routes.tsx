import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import { TrackingSubApps } from '@/tracking.constant';

const RootLayout = lazy(() => import('@/pages/layout'));
const DashboardLayout = lazy(() => import('@/pages/dashboardLayout'));
const ContactsPage = lazy(() => import('@/pages/contacts/Contacts.page'));
const CommunicationsPage = lazy(() =>
  import('@/pages/communications/Communications.page'),
);
const CommunicationsDetailPage = lazy(() =>
  import('@/pages/communications/detail/CommunicationsDetail.page'),
);
const SettingsPage = lazy(() => import('@/pages/settings'));

export default (
  <Route
    path={urls.root}
    Component={RootLayout}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="communication"
      />
    }
  >
    <Route Component={DashboardLayout}>
      <Route
        path={urls.CommunicationsTab}
        Component={CommunicationsPage}
        handle={{
          tracking: {
            pageName: 'communications',
            pageType: PageType.listing,
            subApp: TrackingSubApps.Communications,
          },
        }}
      />
      <Route
        path={urls.CommunicationsDetail}
        Component={CommunicationsDetailPage}
        handle={{
          tracking: {
            pageName: 'subject',
            pageType: PageType.dashboard,
            subApp: TrackingSubApps.Communications,
          },
        }}
      />
      <Route
        path={urls.ContactsTab}
        Component={ContactsPage}
        handle={{
          tracking: {
            pageName: 'contacts',
            pageType: PageType.listing,
            subApp: TrackingSubApps.Contacts,
          },
        }}
      />
      <Route
        path={urls.SettingsTab}
        Component={SettingsPage}
        handle={{
          tracking: {
            pageName: 'preference-center',
            pageType: PageType.dashboard,
            subApp: TrackingSubApps.Settings,
          },
        }}
      />
    </Route>
  </Route>
);
