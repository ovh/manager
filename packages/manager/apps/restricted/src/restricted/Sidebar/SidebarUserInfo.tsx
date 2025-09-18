import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Context from '@/context';

import './sidebar.styles.scss';

const SidebarUserInfos = (): JSX.Element => {
  const { t } = useTranslation('restricted');
  const { auth } = useContext(Context);

  const getUserNameInitials = () => {
    const firstInitial = auth.user?.[0].toUpperCase() || '';
    const lastInitial = auth.user?.split(/\s+/)[1]?.toUpperCase() || '';
    return firstInitial + lastInitial;
  };

  const logout = () => {
    window.location.assign(
      '/auth/?action=disconnect&onsuccess=https://manager.eu.ovhcloud.com/#/hub',
    );
  };

  return (
    <div className="sidebar-user-info mb-3">
      {auth && (
        <>
          <span
            className="
              sidebar-user-info_initials
              sidebar-user-info_initials-centered
            "
          >
            {getUserNameInitials()}
          </span>
          <p className="sidebar-user-info_profile_link mt-3 mb-1">
            {auth.user}
          </p>
          <div
            className="sidebar-user-info_user-name mb-2"
            data-navi-id="account-sidebar-block"
          >
            {auth.method === 'user' && (
              <div>
                <span className="sidebar-user-info_role oui-badge oui-badge_warning">
                  {t('restricted_account_method_user')}
                </span>
              </div>
            )}
          </div>
          <p>
            <span className="d-block sidebar-user-info_text-small">
              {auth.account}
            </span>
          </p>
        </>
      )}
      <div className="text-left sidebar-user-info_links">
        <hr className="my-1" />
        <button
          type="button"
          role="button"
          className="btn btn-link"
          data-navi-id="logout"
          onClick={logout}
        >
          {t('restricted_account_logout')}
        </button>
      </div>
    </div>
  );
};

export default SidebarUserInfos;
