/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../navbar.scss';

// eslint-disable-next-line react/display-name
const DropdownLanguageMenu = React.forwardRef(
  ({ i18next, languages, onSelect }, ref) => (
    <div className="oui-navbar-menu__wrapper" ref={ref}>
      <div className="oui-navbar-menu oui-navbar-menu_fixed oui-navbar-menu_end">
        <div className="oui-navbar-list_dropdown p-4">
          <span className={`oui-navbar-list__title ${styles.languageTitle}`}>
            {i18next.t('navbar_language_change')}
          </span>
          <ul className="oui-navbar-list">
            {languages.map(({ name, key }) => (
              <li className="oui-navbar-list__item" key={key}>
                <button
                  className="oui-navbar-link oui-navbar-link_tertiary p-0"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(key);
                  }}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ),
);

export default DropdownLanguageMenu;
