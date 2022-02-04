import React from 'react';
import PropTypes from 'prop-types';

function HamburgerMenu({ isOpen, onClick }) {
  return (
    <div>
      <button
        role="button"
        type="button"
        className="oui-navbar-toggler oui-navbar-toggler_button"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="oui-navbar-toggler__hamburger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  );
}

HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
};

HamburgerMenu.defaultProps = {
  isOpen: false,
  onClick: () => {},
}

export default HamburgerMenu;
