import { User } from '@ovh-ux/manager-config';
import React from 'react';

import useUserInfos from './useUserInfos';

type Props = {
  cssBaseClassName?: string;
  user?: User;
};

const UserInitials = ({
  cssBaseClassName = '',
  user = {} as User,
}: Props): JSX.Element => {
  const { getUserNameInitials } = useUserInfos(user);

  return (
    <span
      className={`${cssBaseClassName}_initials ${cssBaseClassName}_initials-centered`}
    >
      {getUserNameInitials()}
    </span>
  );
};

export default UserInitials;
