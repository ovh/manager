import React from 'react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import { TRANSLATE_NAMESPACE } from '../constants';

const UserInfosFooter = ({ cssBaseClassName, translationBase }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();

  return (
    <div className={`text-left ${cssBaseClassName}_links`}>
      <hr className="my-1" />
      <button
        type="button"
        role="button"
        className="btn btn-link"
        data-navi-id="logout"
        onClick={() => shell.getPlugin('auth').logout()}
      >
        {t(`${translationBase}_footer_logout`)}
      </button>
    </div>
  );
};

export default UserInfosFooter;
