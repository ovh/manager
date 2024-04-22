import React from 'react';
import { useTranslation } from 'react-i18next';

import { Environment } from '@ovh-ux/manager-config';
import { TRANSLATE_NAMESPACE } from '../constants';

import UserDetails from './UserDetails';
import UserInitials from './UserInitials';
import UserInfosFooter from './UserInfosFooter';
import UserName from './UserName';
import UserRole from './UserRole';
import UserSupportLevel from './UserSupportLevel';

import { useShell } from '@/context';

const UserInfos = (): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const user = environment.getUser();
  const region = environment.getRegion();

  const cssBaseClassName = 'manager-account-sidebar-user-infos';
  const translationBase = 'user_account_menu';
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
        {['EU', 'CA'].includes(region) && (
          <UserSupportLevel
            user={user}
            cssBaseClassName={cssBaseClassName}
            translationBase={translationBase}
          />
        )}
        <UserName user={user} cssBaseClassName={cssBaseClassName} />
      </a>
      <UserRole
        user={user}
        translationBase={translationBase}
      />
      <UserDetails user={user} />
      <UserInfosFooter
        translationBase={translationBase}
      />
    </div>
  );
};

export default UserInfos;
