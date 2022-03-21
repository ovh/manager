import React from 'react';
import PropTypes from 'prop-types'

import { getUserNameInitials } from './utils';

/**
 * Displays user's initials.
 * @component
 */
const UserInitials = ({ user, cssBaseClassName }) => {
  return (
    <span
      className={`${cssBaseClassName}_initials ${cssBaseClassName}_initials-centered`}
    >
      { getUserNameInitials(user) }
    </span>
  );
};

UserInitials.propTypes = {
  user: PropTypes.shape({
    firstname: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  cssBaseClassName: PropTypes.string,
};

UserInitials.defaultProps = {
  user: {},
};

export default UserInitials;
