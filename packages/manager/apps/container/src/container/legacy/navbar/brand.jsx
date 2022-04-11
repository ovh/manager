import React from 'react';
import PropTypes from 'prop-types';

function NavbarBrand({ targetURL, onClick }) {
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

NavbarBrand.propTypes = {
  targetURL: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

NavbarBrand.defaultProps = {
  onClick: () => {},
};

export default NavbarBrand;
