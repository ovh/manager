import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import { TrackingSubApps } from '@/tracking.constant';

const RootLayout = lazy(() => import('@/pages/layout'));
const DashboardLayout = lazy(() => import('@/pages/dashboardLayout'));
const ContactsPage = lazy(() => import('@/pages/contacts/Contacts.page'));
const CreateContactPage = lazy(() =>
  import('@/pages/contacts/create/Create.page'),
);
const EditContactPage = lazy(() => import('@/pages/contacts/edit/Edit.page'));
const ValidateContactPage = lazy(() =>
  import('@/pages/contacts/validate/Validate.page'),
);
const DeleteContactPage = lazy(() =>
  import('@/pages/contacts/delete/Delete.page'),
);
const CommunicationsPage = lazy(() =>
  import('@/pages/communications/Communications.page'),
);
const CommunicationsDetailPage = lazy(() =>
  import('@/pages/communications/detail/CommunicationsDetail.page'),
);
const SettingsPage = lazy(() => import('@/pages/settings/Settings.page'));
const CreateSettingsPage = lazy(() =>
  import('@/pages/settings/create/Create.page'),
);
const EditSettingsPage = lazy(() => import('@/pages/settings/edit/Edit.page'));

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
        path={urls.communication.listing}
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
        path={urls.communication.detail}
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
        path={urls.contact.listing}
        Component={ContactsPage}
        handle={{
          tracking: {
            pageName: 'contacts',
            pageType: PageType.listing,
            subApp: TrackingSubApps.Contacts,
          },
        }}
      >
        <Route
          path={urls.contact.create}
          Component={CreateContactPage}
          handle={{
            tracking: {
              pageName: 'add_contact',
              pageType: PageType.popup,
              subApp: TrackingSubApps.Contacts,
            },
          }}
        />
        <Route
          path={urls.contact.edit}
          Component={EditContactPage}
          handle={{
            tracking: {
              pageName: 'rename_contact',
              pageType: PageType.popup,
              subApp: TrackingSubApps.Contacts,
            },
          }}
        />
        <Route
          path={urls.contact.validate}
          Component={ValidateContactPage}
          handle={{
            tracking: {
              pageName: 'enter_validation_code',
              pageType: PageType.popup,
              subApp: TrackingSubApps.Contacts,
            },
          }}
        />
        <Route
          path={urls.contact.delete}
          Component={DeleteContactPage}
          handle={{
            tracking: {
              pageName: 'delete_contact',
              pageType: PageType.popup,
              subApp: TrackingSubApps.Contacts,
            },
          }}
        />
      </Route>
      <Route
        path={urls.routing.listing}
        Component={SettingsPage}
        handle={{
          tracking: {
            pageName: 'preference-center',
            pageType: PageType.dashboard,
            subApp: TrackingSubApps.Settings,
          },
        }}
      ></Route>
      <Route
        path={urls.routing.create}
        Component={CreateSettingsPage}
        handle={{
          tracking: {
            pageName: 'preference-center::create',
            pageType: PageType.popup,
            subApp: TrackingSubApps.Settings,
          },
        }}
      />
      <Route
        path={urls.routing.edit}
        Component={EditSettingsPage}
        handle={{
          tracking: {
            pageName: 'preference-center::edit',
            pageType: PageType.popup,
            subApp: TrackingSubApps.Settings,
          },
        }}
      />
    </Route>
  </Route>
);
