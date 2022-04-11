import React from 'react';

import PropTypes from 'prop-types';

import useUserInfos from './useUserInfos';

type Props = {
  cssBaseClassName: string;
  user: User;
};

const UserInitials = ({ user, cssBaseClassName }: Props): JSX.Element => {
  const {
    getUserNameInitials,
  } = useUserInfos(user);

  return (
    <span
      className={`${cssBaseClassName}_initials ${cssBaseClassName}_initials-centered`}
    >
      {getUserNameInitials()}
    </span>
  );
};

UserInitials.propTypes = {
  cssBaseClassName: PropTypes.string,
  user: PropTypes.object,
};

UserInitials.defaultProps = {
  cssBaseClassName: '',
  user: {},
};

export default UserInitials;
