import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

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
          },
        }}
      />
      <Route
        path={urls.CommunicationsDetail}
        Component={CommunicationsDetailPage}
      />
      <Route
        path={urls.ContactsTab}
        Component={ContactsPage}
        handle={{
          tracking: {
            pageName: 'contacts',
            pageType: PageType.funnel,
          },
        }}
      >
        <Route
          path={urls.contactsAdd}
          Component={CreateContactPage}
          handle={{
            tracking: {
              pageName: 'contacts::add',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={urls.contactsEdit}
          Component={EditContactPage}
          handle={{
            tracking: {
              pageName: 'contacts::edit',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={urls.contactsValidate}
          Component={ValidateContactPage}
          handle={{
            tracking: {
              pageName: 'contacts::validate',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        path={urls.SettingsTab}
        Component={SettingsPage}
        handle={{
          tracking: {
            pageName: 'settings',
            pageType: PageType.funnel,
          },
        }}
      />
    </Route>
  </Route>
);
