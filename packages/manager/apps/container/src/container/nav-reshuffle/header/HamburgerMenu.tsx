import React from 'react';

export type Props = {
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
        data-testid="hamburgerMenu"
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
