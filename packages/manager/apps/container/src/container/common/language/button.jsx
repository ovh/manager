import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const LanguageButton = ({ children, show, onClick }) => {
  const { t } = useTranslation('language');
  return (
    <button
      aria-haspopup={show}
      aria-expanded={show}
      aria-label={t('language_change')}
      title={t('language_change')}
      type="button"
      className="oui-navbar-link oui-navbar-link_dropdown"
      onClick={(e) => {
        e.preventDefault();
        onClick(!show);
      }}
    >
      <span className="oui-navbar-link__wrapper">
        <span className="oui-navbar-link__text">{children}</span>
        <span className="oui-icon oui-icon-chevron-down ml-2"></span>
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
