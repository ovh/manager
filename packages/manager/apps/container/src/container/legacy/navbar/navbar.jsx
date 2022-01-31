import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { listen } from '@ovh-ux/ufrontend';

import Notifications from '@/container/common/notifications-sidebar/notifications-button';

import Account from './account';
import Brand from './brand.jsx';
import Universes from './universes.jsx';
import Search from './search.jsx';
import Hamburger from './hamburger-menu.jsx';
import LanguageMenu from '@/container/common/language';
import { fetchUniverses, getBrandURL } from './service';
import style from './navbar.module.scss';
import { MESSAGES } from './constants';
import { useShell } from '@/context';

function Navbar({ environment }) {
  const shell = useShell();
  const universe = environment.getUniverse();
  const [userLocale, setUserLocale] = useState(
    shell.getPlugin('i18n').getLocale(),
  );

  const [universes, setUniverses] = useState([]);
  const [searchURL, setSearchURL] = useState();
  const [currentUniverse, setCurrentUniverse] = useState(universe);

  useEffect(() => {
    listen(MESSAGES.navbarSetUniverse, ({ universe: universeParam }) => {
      setCurrentUniverse(universeParam);
    });
    listen(MESSAGES.navbarSearch, ({ url }) => {
      setSearchURL(url);
    });
    fetchUniverses().then(setUniverses);
  }, []);

  return (
    <div className={`oui-navbar ${style.navbar}`}>
      <Hamburger universe={currentUniverse} universes={universes} />
      <Brand targetURL={getBrandURL(universes)} />
      <Universes universe={currentUniverse} universes={universes} />
      <div className="oui-navbar-list oui-navbar-list_aside oui-navbar-list_end">
        {searchURL && (
          <div className="oui-navbar-list__item">
            <Search targetURL={searchURL} />
          </div>
        )}
        <div className="oui-navbar-list__item">
          <LanguageMenu
            setUserLocale={setUserLocale}
            userLocale={userLocale}
          ></LanguageMenu>
        </div>
        <div className="oui-navbar-list__item">
          <Notifications />
        </div>
        <Account user={environment.getUser()} />
      </div>
    </div>
  );
}

Navbar.propTypes = {
  environment: PropTypes.object.isRequired,
};

export default Navbar;
