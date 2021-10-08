import React from 'react';
import { withTranslation } from 'react-i18next';

import UserInfos from './UserInfos';
import PaymentMethod from './PaymentMethod';
import Shortcuts from './Shortcuts';
import UsefulLinks from './UsefulLinks';

import { TRANSLATE_NAMESPACE } from './constants';

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

export default withTranslation(TRANSLATE_NAMESPACE)(AccountSidebar);
