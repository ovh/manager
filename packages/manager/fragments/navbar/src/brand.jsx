import React from 'react';
import PropTypes from 'prop-types';

function NavbarBrand({ targetURL }) {
  return (
    <a className="oui-navbar__brand" href={targetURL} aria-label="OVHcloud">
      <span className="oui-icon oui-icon-ovh" aria-hidden="true"></span>
    </a>
  );
}

NavbarBrand.propTypes = {
  targetURL: PropTypes.string.isRequired,
};

export default NavbarBrand;
