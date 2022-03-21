import React from 'react';
import PropTypes from 'prop-types'

import { getUserDisplayName } from './utils';

/**
 * Displays user's name.
 * @component
 */
const UserName = ({ user, cssBaseClassName }) => {
  return (
    <p className={`${cssBaseClassName}_profile_link mb-1`}>
      { getUserDisplayName(user) }
    </p>
  );
};

UserName.propTypes = {
  user: PropTypes.shape({
    firstname: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  cssBaseClassName: PropTypes.string,
};

UserName.defaultProps = {
  user: {},
};

export default UserName;
