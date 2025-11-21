import { Suspense } from 'react';

import NotificationsSidebar from '@/container/common/notifications-sidebar';
import AccountSidebar from '@/container/legacy/account-sidebar';
import ApplicationContext from '@/context';

import Navbar from './navbar/Navbar';
import { useHeader } from '@/context/header';

function ShellHeader(): JSX.Element {
  const {
    isNotificationsSidebarVisible,
    isAccountSidebarVisible,
  } = useHeader();

  return (
    <ApplicationContext.Consumer>
      {() => (
        <Suspense fallback="">
          <Navbar />
          { isAccountSidebarVisible && <AccountSidebar /> }
          { isNotificationsSidebarVisible && <NotificationsSidebar /> }
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default ShellHeader;
