import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { listen } from '@ovh-ux/ufrontend/communication';

import Brand from './brand.jsx';
import Universes from './universes.jsx';
import Notifications from './notifications.jsx';
import Account from './account.jsx';
import Search from './search.jsx';
import Hamburger from './hamburger-menu.jsx';
import LanguageMenu from './language.jsx';
import { fetchUniverses, getBrandURL } from './service';
import style from './navbar.scss';
import { MESSAGES } from './constants';

function Navbar({ user, universe }) {
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
          <LanguageMenu></LanguageMenu>
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
  user: PropTypes.object.isRequired,
  universe: PropTypes.string,
};

export default Navbar;
