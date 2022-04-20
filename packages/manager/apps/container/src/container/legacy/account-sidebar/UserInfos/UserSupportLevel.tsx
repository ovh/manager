import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import useUserInfos, { User } from './useUserInfos';

type Props = {
  cssBaseClassName?: string;
  translationBase?: string;
  user?: User;
};

const UserSupportLevel = ({
  cssBaseClassName = '',
  translationBase = '',
  user = {},
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const { getSupportLevel, isTrustedUser } = useUserInfos(user);

  const { level } = getSupportLevel();

  return (
    <p className="oui-chip mb-1">
      <span className={`${cssBaseClassName}_text-small`}>
        {t(
          `${translationBase}_support_level_${level}${
            isTrustedUser() ? '_trusted' : ''
          }`,
        )}
      </span>
    </p>
  );
};

export default UserSupportLevel;
