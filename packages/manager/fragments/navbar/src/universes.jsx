import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function NavbarUniverses({ universe, universes }) {
  const { t } = useTranslation();
  return (
    <div className="oui-navbar-list">
      <div className="oui-navbar-list oui-navbar-list_main oui-navbar_desktop-only">
        {universes.length ? (
          universes.map((u) => (
            <a
              className={`
                oui-navbar-link
                oui-navbar-link_${u.isPrimary ? 'primary' : 'secondary'}
                ${universe === u.universe ? 'oui-navbar-link_active' : ''}
              `}
              key={u.universe}
              href={u.url}
            >
              {t(`navbar_universe_${u.universe}`)}
            </a>
          ))
        ) : (
          <span>{t('navbar_loading_universes')}</span>
        )}
      </div>
    </div>
  );
}

NavbarUniverses.propTypes = {
  universe: PropTypes.string,
  universes: PropTypes.array.isRequired,
};

export default NavbarUniverses;
