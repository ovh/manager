import React from 'react';
import { useTranslation } from 'react-i18next';
import { buildURL } from '@ovh-ux/ufrontend';

import { useShell, useUser } from '@/context';
import UserInitials from './UserInitials';
import UserSupportLevel from './UserSupportLevel';
import UserName from './UserName';
import UserRole from './UserRole';
import UserDetails from './UserDetails';
import UserInfosFooter from './UserInfosFooter';

import { TRANSLATE_NAMESPACE } from '../constants';

const UserInfos = () => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const user = useUser();

  const cssBaseClassName = 'manager-account-sidebar-user-infos';
  const translationBase = 'user_infos';
  const userAccountURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/useraccount/dashboard');

  const userAccountClickHander = () =>
    shell.getPlugin('tracking').trackClick({
      name: 'hub::sidebar::profile::go-to-account',
      type: 'action',
    });

  return (
    <div className={`${cssBaseClassName} mb-3`}>
      <a
        className={`${cssBaseClassName}_profile`}
        aria-label={t(`${translationBase}_manage_my_account`)}
        href={userAccountURL}
        target="_top"
        onClick={userAccountClickHander}
      >
        <UserInitials user={user} cssBaseClassName={cssBaseClassName} />
        <UserSupportLevel
          user={user}
          cssBaseClassName={cssBaseClassName}
          translationBase={translationBase}
        />
        <UserName user={user} cssBaseClassName={cssBaseClassName} />
      </a>
      <UserRole
        user={user}
        cssBaseClassName={cssBaseClassName}
        translationBase={translationBase}
      />
      <UserDetails user={user} cssBaseClassName={cssBaseClassName} />
      <UserInfosFooter
        cssBaseClassName={cssBaseClassName}
        translationBase={translationBase}
      />
    </div>
  );
};

export default UserInfos;
