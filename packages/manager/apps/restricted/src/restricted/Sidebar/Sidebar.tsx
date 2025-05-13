import React, { useContext, useRef } from 'react';
import useClickAway from 'react-use/lib/useClickAway';

import Context from '@/context';
import SidebarUserInfo from './SidebarUserInfo';

import './sidebar.styles.scss';

const Sidebar = (): JSX.Element => {
  const ref = useRef();
  const { isSidebarVisible, setIsSidebarVisible } = useContext(Context);

  useClickAway(ref, (event: MouseEvent) => {
    const target = event.target as Element;
    if (target.closest('#account-button')) {
      return;
    }
    setIsSidebarVisible(false);
  });

  return (
    <div
      ref={ref}
      className="sidebar-container"
      aria-expanded={isSidebarVisible}
    >
      <div className="sidebar">
        <SidebarUserInfo />
      </div>
    </div>
  );
};

export default Sidebar;
