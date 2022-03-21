import React from 'react';
import PropTypes from 'prop-types'

/**
 * Displays basic information about a user: its nic, organization and email.
 * @component
 */
const UserDetails = ({ user, cssBaseClassName }) => {
  return (
    <p>
    { user.organisation && (
      <span
        className={`d-block ${cssBaseClassName}_text-small`}
      >
        { user.organisation }
      </span>
    )}
      <span
        className={`d-block ${cssBaseClassName}_text-small text-break`}
      >
          { user.email }
      </span>
    { user.email !== user.nichandle && (
      <span
        className={`d-block ${cssBaseClassName}_text-small`}
      >
        { user.nichandle }
      </span>
    )}
    </p>
  );
};

UserDetails.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    nichandle: PropTypes.string,
    organisation: PropTypes.string,
  }).isRequired,
  cssBaseClassName: PropTypes.string,
};

UserDetails.defaultProps = {
  user: {},
};

export default UserDetails;
