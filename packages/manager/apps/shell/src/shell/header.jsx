import React, { Suspense } from 'react';
import Navbar from '../navbar/navbar.jsx';
import AccountSidebar from '../account-sidebar';
import NotificationsSidebar from '../notifications-sidebar';
import { NotificationsProvider } from '../core/notifications';
import ApplicationContext from '../context';

function ShellHeader() {
  return (
    <ApplicationContext.Consumer>
      {({ environment, ux }) => (
        <Suspense fallback="">
          <NotificationsProvider environment={environment}>
            <Navbar environment={environment} ux={ux} />
            <AccountSidebar environment={environment} ux={ux} />
            <NotificationsSidebar environment={environment} ux={ux} />
          </NotificationsProvider>
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default ShellHeader;
