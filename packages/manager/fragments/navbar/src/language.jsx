import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import { emit } from '@ovh-ux/ufrontend/communication';
import { Environment, LANGUAGES } from '@ovh-ux/manager-config';
import style from './navbar.scss';
import { MESSAGES } from './constants';

function LanguageMenu({ i18next }) {
  const availableLanguage = LANGUAGES.available.find(
    ({ key }) => key === Environment.getUserLocale(),
  );
  return (
    <Dropdown alignRight>
      <Dropdown.Toggle
        className="oui-navbar-link oui-navbar-link_tertiary"
        aria-label={i18next.t('navbar_language_change')}
        title={i18next.t('navbar_language_change')}
      >
        {availableLanguage.name}
      </Dropdown.Toggle>
      <Dropdown.Menu className={style.dropdownMenu}>
        <div>
          <span className={`oui-navbar-list__title ${style.languageTitle}`}>
            {i18next.t('navbar_language_change')}
          </span>
          {LANGUAGES.available.map(({ name, key }) => (
            <Dropdown.Item
              key={key}
              className="oui-navbar-link oui-navbar-link_tertiary"
              onClick={() =>
                emit({
                  id: MESSAGES.localeChange,
                  locale: key,
                })
              }
            >
              {name}
            </Dropdown.Item>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

LanguageMenu.propTypes = {
  i18next: PropTypes.object.isRequired,
};

export default LanguageMenu;
