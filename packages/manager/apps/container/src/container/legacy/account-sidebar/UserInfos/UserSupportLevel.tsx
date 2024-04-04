import { User } from '@ovh-ux/manager-config';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import useUserInfos from './useUserInfos';

import {OsdsText} from '@ovhcloud/ods-components/react'
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT, ODS_THEME_COLOR_HUE } from '@ovhcloud/ods-common-theming';


type Props = {
  cssBaseClassName?: string;
  translationBase?: string;
  user?: User;
};

const UserSupportLevel = ({
  cssBaseClassName = '',
  translationBase = '',
  user = {} as User,
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const { getSupportLevel, isTrustedUser } = useUserInfos(user);

  const { level } = getSupportLevel();

  return (
    <p className="oui-chip mb-1">
       <OsdsText color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            hue={ODS_THEME_COLOR_HUE._700}
            className='m-1'
            >{t(
              `${translationBase}_support_level_${level}${
                isTrustedUser() ? '_trusted' : ''
              }`,
            )}</OsdsText>

    </p>
  );
};

export default UserSupportLevel;
