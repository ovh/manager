import React from 'react';

import useUserInfos from './useUserInfos';

const UserInitials = ({ user, cssBaseClassName }) => {
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

export default UserInitials;
