import { User } from '@ovh-ux/manager-config';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import useUserInfos from './useUserInfos';

type Props = {
  cssBaseClassName?: string;
  translationBase?: string;
  user?: User;
};

const UserRole = ({
  cssBaseClassName = '',
  translationBase = '',
  user = {} as User,
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const role = useUserInfos(user).getUserRole();

  return (
    <div
      className={`${cssBaseClassName}_user-name`}
      data-navi-id="account-sidebar-block"
    >
      {role && (
        <div>
          <span
            className={`${cssBaseClassName}_role oui-badge oui-badge_warning`}
          >
            {t(`${translationBase}_role_${role}`)}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserRole;
