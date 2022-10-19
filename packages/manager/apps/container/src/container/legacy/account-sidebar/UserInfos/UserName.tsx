import { User } from '@ovh-ux/manager-config';
import React from 'react';

import useUserInfos from './useUserInfos';

type Props = {
  cssBaseClassName?: string;
  user?: User;
};

const UserName = ({
  cssBaseClassName = '',
  user = {} as User,
}: Props): JSX.Element => {
  const { getUserDisplayName } = useUserInfos(user);

  return (
    <p className={`${cssBaseClassName}_profile_link mb-1`}>
      {getUserDisplayName()}
    </p>
  );
};

export default UserName;
