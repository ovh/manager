import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function NavbarSearch({ targetURL }) {
  const { t } = useTranslation();
  return (
    <a
      className="oui-navbar-link oui-navbar-link_tertiary oui-navbar-link_icon px-0 text-center"
      href={targetURL}
    >
      <span
        className="navbar-small-icon oui-icon oui-icon-search_extra-thin mr-0"
        aria-hidden="true"
      ></span>
      <span className="sr-only">{t('navbar_search')}</span>
    </a>
  );
}

NavbarSearch.propTypes = {
  targetURL: PropTypes.string.isRequired,
};

export default NavbarSearch;
