import React from 'react';

import UserInfos from './UserInfos';
import PaymentMethod from './PaymentMethod/PaymentMethod.jsx';
import Shortcuts from './Shortcuts';
import UsefulLinks from './UsefulLinks';

const AccountSidebar = ({ environment, ux }) => {
  return (
    <div
      className="manager-account-sidebar-wrapper"
      aria-expanded={ux.sidebars.account.isOpen}
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
