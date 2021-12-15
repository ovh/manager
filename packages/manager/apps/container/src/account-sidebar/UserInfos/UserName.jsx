import React from 'react';

import useUserInfos from './useUserInfos';

const UserName = ({ user, cssBaseClassName }) => {
  const { getUserDisplayName } = useUserInfos(user);

  return (
    <p className={`${cssBaseClassName}_profile_link mb-1`}>
      {getUserDisplayName()}
    </p>
  );
};

export default UserName;
