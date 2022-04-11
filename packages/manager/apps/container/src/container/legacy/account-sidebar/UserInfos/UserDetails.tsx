import React from 'react';

import PropTypes from 'prop-types';

import { User } from './useUserInfos';

type Props = {
  cssBaseClassName: string;
  user: User;
};

const UserDetails = ({ user, cssBaseClassName }: Props): JSX.Element => {
  const { organisation, email, nichandle } = user;

  return (
    <p>
      {organisation && (
        <span className={`d-block ${cssBaseClassName}_text-small`}>
          {organisation}
        </span>
      )}
      <span className={`d-block ${cssBaseClassName}_text-small text-break`}>
        {email}
      </span>
      {email !== nichandle && (
        <span className={`d-block ${cssBaseClassName}_text-small`}>
          {nichandle}
        </span>
      )}
    </p>
  );
};

UserDetails.propTypes = {
  cssBaseClassName: PropTypes.string,
  user: PropTypes.object,
};

UserDetails.defaultProps = {
  cssBaseClassName: '',
  user: {},
};

export default UserDetails;
