import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { listen } from '@ovh-ux/ufrontend';

import Notifications from '@/container/common/notifications-sidebar/notifications-button';

import Account from './account';
import Brand from './brand.jsx';
import Universes from './universes.jsx';
import Search from './search.jsx';
import Hamburger from './hamburger-menu.jsx';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import LanguageMenu from '@/container/common/language';
import { fetchUniverses, getBrandURL } from './service';
import style from './navbar.module.scss';
import modalStyle from '@/container/common/modal.module.scss';
import { MESSAGES } from './constants';
import { useShell } from '@/context';

function Navbar({ environment }) {
  const shell = useShell();
  const environmentPlugin = shell.getPlugin('environment');
  const [userLocale, setUserLocale] = useState(
    shell.getPlugin('i18n').getLocale(),
  );

  const [universes, setUniverses] = useState([]);
  const [searchURL, setSearchURL] = useState();
  const [currentUniverse, setCurrentUniverse] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    environmentPlugin.onUniverseChange(() => {
      setCurrentUniverse(environment.getUniverse());
    });

    listen(MESSAGES.navbarSearch, ({ url }) => {
      setSearchURL(url);
    });
    fetchUniverses().then(setUniverses);
  }, []);

  const brandClickHandler = () =>
    shell.getPlugin('tracking').trackClick({
      name: `navbar::entry::logo`,
      type: 'action',
    });

  const universeClickHandler = ({ universe }) =>
    shell.getPlugin('tracking').trackClick({
      name: `navbar::entry::${universe}`,
      type: 'action',
    });

  return (
    <>
      <div
        className={`${modalStyle.popoverClickAway} ${
          isDropdownOpen ? '' : modalStyle.hidden
        }`}
      ></div>
      <div className={`oui-navbar ${style.navbar}`}>
        <Hamburger universe={currentUniverse} universes={universes} />
        <Brand targetURL={getBrandURL(universes)} onClick={brandClickHandler} />
        <Universes
          universe={currentUniverse}
          universes={universes}
          onClick={universeClickHandler}
        />
        <div className="oui-navbar-list oui-navbar-list_aside oui-navbar-list_end">
          {searchURL && (
            <div className="oui-navbar-list__item">
              <Search targetURL={searchURL} />
            </div>
          )}
          <div className="oui-navbar-list__item">
            <NavReshuffleSwitchBack
              onChange={({ show }) => setIsDropdownOpen(show)}
            />
          </div>
          <div className="oui-navbar-list__item">
            <LanguageMenu
              setUserLocale={setUserLocale}
              userLocale={userLocale}
              onChange={({ show }) => setIsDropdownOpen(show)}
            ></LanguageMenu>
          </div>
          <div className="oui-navbar-list__item">
            <Notifications />
          </div>
          <Account user={environment.getUser()} />
        </div>
      </div>
    </>
  );
}

Navbar.propTypes = {
  environment: PropTypes.object.isRequired,
};

export default Navbar;
