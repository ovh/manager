import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { listen } from '@ovh-ux/ufrontend/communication';

import Brand from './brand.jsx';
import Universes from './universes.jsx';
import Notifications from './notifications.jsx';
import Account from './account.jsx';
import Search from './search.jsx';
import Hamburger from './hamburger-menu.jsx';
import { fetchUniverses, getBrandURL } from './service';
import style from './navbar.scss';
import { MESSAGES } from './constants';

function fetchLanguageComponent() {
  return import('./language.jsx').then(({ default: component }) => component);
}

// note: since the language component is dynamically imported
// we need to pass it the i18next instance
function Navbar({ i18next, user, universe }) {
  const [LanguageMenu, setLanguageMenu] = useState();
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
    fetchLanguageComponent().then((component) => {
      setLanguageMenu(component({ i18next }));
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
        <div className="oui-navbar-list__item">{LanguageMenu}</div>
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
  i18next: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  universe: PropTypes.string,
};

export default Navbar;
