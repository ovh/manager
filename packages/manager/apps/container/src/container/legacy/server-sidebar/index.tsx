import React, { useEffect, useState } from 'react';
import useContainer from '@/core/container';
import { useLegacyContainer } from '@/container/legacy/context';
import { useLocation } from 'react-router-dom';
import style from './index.module.scss';

const AccountSidebar = React.lazy(() => import('./universe/AccountSidebar'));
const DedicatedSidebar = React.lazy(() =>
  import('./universe/DedicatedSidebar'),
);
const TelecomSidebar = React.lazy(() => import('./universe/TelecomSidebar'));
const HostedPrivateCloudSidebar = React.lazy(() =>
  import('./universe/HostedPrivateCloudSidebar'),
);
const WebSidebar = React.lazy(() => import('./universe/WebSidebar'));

export default function ServerSidebarIndex() {
  const { isResponsiveSidebarMenuOpen } = useLegacyContainer();
  const { application, universe } = useContainer();
  const [isAccountMenu, setIsAccountMenu] = useState(false);
  const location = useLocation();
  const isUniverseMenu = ['server', 'telecom', 'web'].indexOf(universe) >= 0;

  useEffect(() => {
    if (universe === 'server') {
      setIsAccountMenu(
        [
          '/useraccount',
          '/billing',
          '/contacts',
          '/support',
          '/ticket',
        ].some((route) =>
          location.pathname.startsWith(
            `/${application.container.path}${route}`,
          ),
        ),
      );
    }
  }, [universe, location]);

  if (isAccountMenu) {
    return (
      <div
        className={`${style.serverSidebar} ${
          isResponsiveSidebarMenuOpen ? style.serverSidebarOpen : ''
        }`}
        role="navigation"
      >
        <AccountSidebar />
      </div>
    );
  }
  if (universe === 'hpc') {
    return (
      <div
        className={`${style.serverSidebar} ${
          isResponsiveSidebarMenuOpen ? style.serverSidebarOpen : ''
        }`}
        role="navigation"
      >
        <HostedPrivateCloudSidebar />
      </div>
    );
  }
  if (isUniverseMenu) {
    return (
      <div
        className={`${style.serverSidebar} ${
          isResponsiveSidebarMenuOpen ? style.serverSidebarOpen : ''
        }`}
        role="navigation"
      >
        {universe === 'server' && <DedicatedSidebar />}
        {universe === 'telecom' && <TelecomSidebar />}
        {universe === 'web' && <WebSidebar />}
      </div>
    );
  }
  return undefined;
}
