import React from 'react';
import { useTranslation } from 'react-i18next';
import { buildURL } from '@ovh-ux/ufrontend';

import { useShell } from '@/context';
import UserInitials from './UserInitials.jsx';
import UserSupportLevel from './UserSupportLevel.jsx';
import UserName from './UserName.jsx';
import UserRole from './UserRole.jsx';
import UserDetails from './UserDetails.jsx';
import UserInfosFooter from './UserInfosFooter.jsx';

import { TRANSLATE_NAMESPACE } from '../constants';

const UserInfos = () => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();

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
