import React, { Suspense } from 'react';
import AccountSidebar from '@/container/legacy/account-sidebar';
import NotificationsSidebar from '@/container/common/notifications-sidebar';
import Navbar from './navbar/navbar.jsx';
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
