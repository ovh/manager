import React from 'react';

import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import { TRANSLATE_NAMESPACE } from '../constants';

import {OsdsLink} from '@ovhcloud/ods-components/react'
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';


type Props = {
  translationBase?: string;
};

const UserInfosFooter = ({
  translationBase = '',
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();

  const logoutHandler = () => {
    shell.getPlugin('tracking').trackClick({
      name: 'hub::sidebar::profile::go-to-log-out',
      type: 'action',
    });
    shell.getPlugin('auth').logout();
  };

  return (
    <div>
      <hr className="my-1"/>
      <OsdsLink
        onClick={logoutHandler}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="flex font-bold m-3"
      > {t(`${translationBase}_logout`)}</OsdsLink>
    </div>
  );
};

export default UserInfosFooter;
