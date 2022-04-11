import React from 'react';

import UserInfos from './UserInfos';
import PaymentMethod from './PaymentMethod/PaymentMethod.jsx';
import Shortcuts from './Shortcuts';
import UsefulLinks from './UsefulLinks';
import { useHeader } from '@/context/header';

const AccountSidebar = () => {
  const { isAccountSidebarVisible } = useHeader();
  return (
    <div
      className="manager-account-sidebar-wrapper"
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
