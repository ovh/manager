import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { emit } from '@ovh-ux/ufrontend/communication';
import style from './navbar.scss';
import { MESSAGES } from './constants';

function HamburgerMenu({ universe, universes }) {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();

  function onUniverseClick({ event, destination }) {
    if (universe === destination) {
      event.preventDefault();
      emit({
        id: MESSAGES.navigationSidebarShow,
      });
      setOpened(false);
    }
  }

  return (
    <div>
      <button
        role="button"
        type="button"
        className="oui-navbar-toggler oui-navbar-toggler_button"
        onClick={() => setOpened(!opened)}
        aria-expanded={opened}
      >
        <span className="oui-navbar-toggler__hamburger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div
        className={`oui-navbar-menu_toggle oui-navbar-menu oui-navbar-menu_fixed ${opened &&
          style.hamburgerOpen}`}
        aria-expanded="true"
        role="menu"
      >
        {universes.map((u) => (
          <a
            className={`oui-navbar-link oui-navbar-link_${
              u.isPrimary ? 'primary' : 'secondary'
            }`}
            key={u.universe}
            href={u.url}
            onClick={(event) =>
              onUniverseClick({
                event,
                destination: u.universe,
              })
            }
          >
            {t(`navbar_universe_${u.universe}`)}
            {universe === u.universe ? (
              <span className="oui-icon oui-icon-chevron-right float-right"></span>
            ) : (
              ''
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

HamburgerMenu.propTypes = {
  universe: PropTypes.string,
  universes: PropTypes.array.isRequired,
};

export default HamburgerMenu;
