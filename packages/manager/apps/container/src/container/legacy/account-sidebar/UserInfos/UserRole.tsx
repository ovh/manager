import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import useUserInfos, { User } from './useUserInfos';

type Props = {
  cssBaseClassName: string;
  translationBase: string;
  user: User;
};


const UserRole = ({
  cssBaseClassName,
  translationBase,
  user,
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const role = useUserInfos(user).getUserRole();

  return (
    <div
      className={`${cssBaseClassName}_user-name mb-2`}
      data-navi-id="account-sidebar-block"
    >
     {role && (
        <div>
          <span
              className={`${cssBaseClassName}_role oui-badge oui-badge_warning`}
          >
            { t(`${translationBase}_role_${role}`) }
          </span>
        </div>
      )}
    </div>
  );
};

UserRole.propTypes = {
  cssBaseClassName: PropTypes.string,
  translationBase: PropTypes.string,
  user: PropTypes.object,
};

UserRole.defaultProps = {
  cssBaseClassName: '',
  translationBase: '',
  user: {},
};

export default UserRole;
