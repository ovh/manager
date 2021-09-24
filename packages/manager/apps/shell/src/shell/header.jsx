import React, { Suspense, useState } from 'react';
import Navbar from '@/navbar/navbar.jsx';
import AccountSidebar from '@/account-sidebar';
import ApplicationContext from '@/context';

function ShellHeader() {
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(true);

  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
        <Suspense fallback="">
          <Navbar
            environment={environment}
            isAccountSidebarOpen={isAccountSidebarOpen}
            setIsAccountSidebarOpen={setIsAccountSidebarOpen}
          />
          <AccountSidebar
            environment={environment}
            isAccountSidebarOpen={isAccountSidebarOpen}
          />
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default ShellHeader;
