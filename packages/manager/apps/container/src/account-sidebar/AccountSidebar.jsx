import React, { useContext } from 'react';

import UserInfos from './UserInfos';
import PaymentMethod from './PaymentMethod/PaymentMethod.jsx';
import Shortcuts from './Shortcuts';
import UsefulLinks from './UsefulLinks';
import ApplicationContext from '../context/application.context.js';

const AccountSidebar = ({ environment }) => {
  const { shell } = useContext(ApplicationContext);
  const ux = shell.ux();
  console.log(ux);
  return (
    <div
      className="manager-account-sidebar-wrapper"
      aria-expanded={ux.getSidebars().account.visible}
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
