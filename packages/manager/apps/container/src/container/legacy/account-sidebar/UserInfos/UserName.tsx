import React from 'react';

import useUserInfos, { User } from './useUserInfos';

type Props = {
  cssBaseClassName?: string;
  user?: User;
};

const UserName = ({ cssBaseClassName = '', user = {} }: Props): JSX.Element => {
  const { getUserDisplayName } = useUserInfos(user);

  return (
    <p className={`${cssBaseClassName}_profile_link mb-1`}>
      {getUserDisplayName()}
    </p>
  );
};

export default UserName;
