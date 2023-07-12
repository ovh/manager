import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Context from '@/context';
import LanguageMenu from './LanguageMenu/LanguageMenu';

import './restricted.styles.scss';

const Navbar = (): JSX.Element => {
  const { t } = useTranslation('restricted');
  const { auth, setIsSidebarVisible } = useContext(Context);

  return (
    <>
      <div className={`oui-navbar navbar`}>
        <div className="oui-navbar__brand" aria-label="OVHcloud">
          <span className="oui-icon oui-icon-ovh" aria-hidden="true"></span>
        </div>
        <div className="oui-navbar-list oui-navbar-list_aside oui-navbar-list_end aside">
          <div className="oui-navbar-list__item">
            <LanguageMenu />
          </div>
          <button
            id="account-button"
            role="button"
            type="button"
            className="oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary"
            aria-label={t('restricted_navbar_account')}
            onClick={() =>
              setIsSidebarVisible((isSidebarVisible) => !isSidebarVisible)
            }
          >
            <span className="oui-navbar-link__wrapper oui-navbar-link__wrapper_border">
              <span
                className="oui-icon navbar-oui-icon oui-icon-user"
                aria-hidden="true"
              ></span>
              <span className="oui-navbar-link__text">{auth?.user}</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
