import React from 'react';

import PropTypes from 'prop-types';

import useUserInfos, { User } from './useUserInfos';

type Props = {
  cssBaseClassName: string;
  user: User;
};

const UserName = ({ user, cssBaseClassName }: Props): JSX.Element => {
  const { getUserDisplayName } = useUserInfos(user);

  return (
    <p className={`${cssBaseClassName}_profile_link mb-1`}>
      {getUserDisplayName()}
    </p>
  );
};

UserName.propTypes = {
  cssBaseClassName: PropTypes.string,
  user: PropTypes.object,
};

UserName.defaultProps = {
  cssBaseClassName: '',
  user: {},
};

export default UserName;
