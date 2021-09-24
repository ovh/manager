import React from 'react';
import { useTranslation } from 'react-i18next';

import useUserInfos from './useUserInfos';
import { TRANSLATE_NAMESPACE } from '../constants';

const UserSupportLevel = ({ user, cssBaseClassName, translationBase }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const {
    getSupportLevel,
    isTrustedUser,
  } = useUserInfos(user);

  const { level } = getSupportLevel();

  return (
    <p
      className="oui-chip mb-1"
    >
      <span
        className={`${cssBaseClassName}_text-small`}
      >
        { t(`${translationBase}_support_level_${level}${isTrustedUser() ? '_trusted' : ''}`) }
      </span>
    </p>
  );
};

export default UserSupportLevel;
