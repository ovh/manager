import React from 'react';

import UserInfos from './UserInfos';
import PaymentMethod from './PaymentMethod/PaymentMethod.jsx';
import Shortcuts from './Shortcuts';
import UsefulLinks from './UsefulLinks';
import useHeader from '@/core/header';

const AccountSidebar = ({ environment }) => {
  const { isAccountSidebarVisible } = useHeader();

  return (
    <div
      className="manager-account-sidebar-wrapper"
      aria-expanded={isAccountSidebarVisible}
    >
      <div className="manager-account-sidebar">
        <UserInfos environment={environment} />
        <PaymentMethod environment={environment} />
        <Shortcuts environment={environment} />
        <UsefulLinks environment={environment} />
      </div>
    </div>
  );
};

export default AccountSidebar;
