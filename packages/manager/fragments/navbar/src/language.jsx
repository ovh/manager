import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import { Environment, LANGUAGES } from '@ovh-ux/manager-config';
import { emit } from '@ovh-ux/ufrontend/communication';
import { MESSAGES } from './constants';

import LanguageButton from './language/button.jsx';
import LanguageList from './language/list.jsx';

function LanguageMenu({ i18next }) {
  const availableLanguage = LANGUAGES.available.find(
    ({ key }) => key === Environment.getUserLocale(),
  );

  return (
    <Dropdown alignRight className="oui-navbar-dropdown">
      <Dropdown.Toggle as={LanguageButton}>
        {availableLanguage.name}
      </Dropdown.Toggle>

      <Dropdown.Menu
        as={LanguageList}
        languages={LANGUAGES.available}
        i18next={i18next}
        onSelect={(locale) =>
          emit({
            id: MESSAGES.localeChange,
            locale,
          })
        }
      ></Dropdown.Menu>
    </Dropdown>
  );
}

LanguageMenu.propTypes = {
  i18next: PropTypes.object.isRequired,
};

export default LanguageMenu;
