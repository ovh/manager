import React, { Suspense } from 'react';
import Navbar from '@/navbar/navbar.jsx';
import AccountSidebar from '@/account-sidebar';
import NotificationsSidebar from '@/notifications-sidebar';
import { NotificationsProvider } from '@/core/notifications';
import ApplicationContext from '@/context';

function ShellHeader() {
  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
        <Suspense fallback="">
          <NotificationsProvider environment={environment}>
            <Navbar environment={environment} />
            <AccountSidebar environment={environment} />
            <NotificationsSidebar environment={environment} />
          </NotificationsProvider>
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default ShellHeader;
