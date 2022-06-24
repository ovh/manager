import React, { Suspense } from 'react';

import NotificationsSidebar from '@/container/common/notifications-sidebar';
import AccountSidebar from '@/container/legacy/account-sidebar';
import ApplicationContext from '@/context';
import { NotificationsProvider } from '@/core/notifications';

import Navbar from './navbar/Navbar';

function ShellHeader(): JSX.Element {
  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
        <Suspense fallback="">
          <NotificationsProvider environment={environment}>
            <Navbar environment={environment} />
            <AccountSidebar />
            <NotificationsSidebar environment={environment} />
          </NotificationsProvider>
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default ShellHeader;
