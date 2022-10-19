import React, { Suspense } from 'react';

import NotificationsSidebar from '@/container/common/notifications-sidebar';
import AccountSidebar from '@/container/legacy/account-sidebar';
import ApplicationContext from '@/context';

import Navbar from './navbar/Navbar';

function ShellHeader(): JSX.Element {
  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
        <Suspense fallback="">
          <Navbar environment={environment} />
          <AccountSidebar />
          <NotificationsSidebar />
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default ShellHeader;
