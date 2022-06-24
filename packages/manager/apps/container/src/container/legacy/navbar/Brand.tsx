import React from 'react';

type Props = {
  onClick?(): void;
  targetURL: string;
};

function NavbarBrand({ onClick = () => {}, targetURL }: Props): JSX.Element {
  return (
    <a
      className="oui-navbar__brand"
      href={targetURL}
      aria-label="OVHcloud"
      onClick={onClick}
    >
      <span className="oui-icon oui-icon-ovh" aria-hidden="true"></span>
    </a>
  );
}

export default NavbarBrand;
