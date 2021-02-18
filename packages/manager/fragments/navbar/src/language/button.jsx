import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const LanguageButton = ({ children, show, onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      aria-haspopup={show}
      aria-expanded={show}
      aria-label={t('navbar_language_change')}
      title={t('navbar_language_change')}
      type="button"
      className="oui-navbar-link oui-navbar-link_dropdown"
      onClick={(e) => {
        e.preventDefault();
        onClick(!show);
      }}
    >
      <span className="oui-navbar-link__wrapper">
        <span className="oui-navbar-link__text">{children}</span>
      </span>
    </button>
  );
};

LanguageButton.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LanguageButton;
