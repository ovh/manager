import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { listen } from '@ovh-ux/ufrontend';

import Brand from './Brand';
import Universes from './Universes';
import Notifications from './Notifications';
import Account from './Account';
import Search from './Search';
import Hamburger from './HamburgerMenu';
import LanguageMenu from './Language';
import { fetchUniverses, getBrandURL } from './service';
import style from './navbar.module.scss';
import { MESSAGES } from './constants';
import { useShell } from '../context';

function Navbar({ environment }) {
  const shell = useShell();
  const environmentPlugin = shell.getPlugin('environment');
  const user = environment.getUser();
  const [userLocale, setUserLocale] = useState(
    shell.getPlugin('i18n').getLocale(),
  );

  const [universes, setUniverses] = useState([]);
  const [searchURL, setSearchURL] = useState();
  const [currentUniverse, setCurrentUniverse] = useState();

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
          <LanguageMenu
            setUserLocale={setUserLocale}
            userLocale={userLocale}
          />
        </div>
        <div className="oui-navbar-list__item">
          <Notifications />
        </div>
        <div className="oui-navbar-list__item">
          <Account user={user} />
        </div>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  environment: PropTypes.object.isRequired,
};

export default Navbar;
