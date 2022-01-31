import React, { useState } from 'react';
import PropTypes from 'prop-types';

function HamburgerMenu({ onToggle }) {
  const [opened, setOpened] = useState(false);

  function toggle() {
    setOpened(!opened);
    onToggle(opened);
  }

  return (
    <div>
      <button
        role="button"
        type="button"
        className="oui-navbar-toggler oui-navbar-toggler_button"
        onClick={toggle}
        aria-expanded={opened}
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
  onToggle: PropTypes.func,
};

HamburgerMenu.defaultProps = {
  onToggle: () => {},
}

export default HamburgerMenu;
