import React from 'react';

type Props = {
  isOpen?: boolean;
  onClick?(): void;
};

function HamburgerMenu({
  isOpen = false,
  onClick = () => {},
}: Props): JSX.Element {
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

export default HamburgerMenu;
