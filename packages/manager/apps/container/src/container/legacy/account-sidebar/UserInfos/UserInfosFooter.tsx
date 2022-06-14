import React from 'react';

import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import { TRANSLATE_NAMESPACE } from '../constants';

type Props = {
  cssBaseClassName?: string;
  translationBase?: string;
};

const UserInfosFooter = ({
  cssBaseClassName = '',
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
    <div className={`text-left ${cssBaseClassName}_links`}>
      <hr className="my-1" />
      <button
        type="button"
        role="button"
        className="btn btn-link"
        data-navi-id="logout"
        onClick={logoutHandler}
      >
        {t(`${translationBase}_logout`)}
      </button>
    </div>
  );
};

export default UserInfosFooter;
