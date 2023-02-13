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
const PublicCloudSidebar = React.lazy(() =>
  import('./universe/public-cloud/PublicCloudSidebar'),
);
const WebSidebar = React.lazy(() => import('./universe/WebSidebar'));

export default function ServerSidebarIndex() {
  const { isResponsiveSidebarMenuOpen } = useLegacyContainer();
  const { application, universe } = useContainer();
  const [isAccountMenu, setIsAccountMenu] = useState(false);
  const location = useLocation();
  const isUniverseMenu =
    ['public-cloud', 'server', 'telecom', 'web'].indexOf(universe) >= 0;

  useEffect(() => {
    if (application?.container?.path === 'dedicated') {
      setIsAccountMenu(
        [
          '/useraccount',
          '/billing',
          '/contact',
          '/contacts',
          '/support',
          '/ticket',
        ].some((route) =>
          location.pathname.startsWith(
            `/${application.container.path}${route}`,
          ),
        ),
      );
    } else {
      setIsAccountMenu(false);
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
  if (universe === 'public-cloud') {
    const isPciSidebarHidden = !/\/pci\/projects\/\w{32,}/.test(location?.pathname);
    if (isPciSidebarHidden) {
      return <></>;
    }
  }
  if (isUniverseMenu) {
    return (
      <div
        className={`${style.serverSidebar} ${
          isResponsiveSidebarMenuOpen ? style.serverSidebarOpen : ''
        }`}
        role="navigation"
      >
        {universe === 'public-cloud' && <PublicCloudSidebar />}
        {universe === 'server' && <DedicatedSidebar />}
        {universe === 'telecom' && <TelecomSidebar />}
        {universe === 'web' && <WebSidebar />}
      </div>
    );
  }
  return undefined;
}
