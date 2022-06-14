import React from 'react';

import PaymentMethod from './PaymentMethod/PaymentMethod';
import Shortcuts from './Shortcuts';
import UsefulLinks from './UsefulLinks';
import UserInfos from './UserInfos';

import { useHeader } from '@/context/header';

const AccountSidebar = (): JSX.Element => {
  const {
    isAccountSidebarLargeScreenDisplayForced,
    isAccountSidebarVisible,
  } = useHeader();
  return (
    <div
      className={`manager-account-sidebar-wrapper${
        isAccountSidebarLargeScreenDisplayForced
          ? ' force-large-screen-display'
          : ''
      }`}
      aria-expanded={isAccountSidebarVisible}
    >
      <div className="manager-account-sidebar">
        <UserInfos />
        <PaymentMethod />
        <Shortcuts />
        <UsefulLinks />
      </div>
    </div>
  );
};

export default AccountSidebar;
