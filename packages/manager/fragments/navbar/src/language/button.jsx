import React from 'react';

// eslint-disable-next-line react/display-name
const DropdownLanguageToggle = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ children, onClick }, ref) => (
    <button
      ref={ref}
      aria-haspopup="true"
      aria-expanded="true"
      aria-label="{ i18next.t('navbar_language_change') }"
      title="{ i18next.t('navbar_language_change') }"
      type="button"
      className="oui-navbar-link oui-navbar-link_dropdown dropdown-toggle"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <span className="oui-navbar-link__wrapper">
        <span className="oui-navbar-link__text">{children}</span>
      </span>
    </button>
  ),
);

export default DropdownLanguageToggle;
