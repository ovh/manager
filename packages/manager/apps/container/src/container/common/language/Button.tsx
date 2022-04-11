import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

type Props = {
  children: JSX.Element;
  onClick(e: MouseEvent): void;
  show: boolean;
};

function LanguageButton({ children, onClick, show }: Props): JSX.Element {
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
}

LanguageButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

LanguageButton.defaultProps = {
  children: null,
  show: false,
};

export default LanguageButton;
