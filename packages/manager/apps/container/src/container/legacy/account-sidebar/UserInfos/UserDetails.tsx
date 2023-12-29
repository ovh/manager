import { User } from '@ovh-ux/manager-config';
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { TRANSLATE_NAMESPACE } from '../constants';

type Props = {
  cssBaseClassName?: string;
  user?: User;
};

const UserDetails = ({
  cssBaseClassName = '',
  user = {} as User,
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const { organisation, email, nichandle, auth } = user;

  return (
    <p>
      {
        <>
          {organisation && (
            <span className={`d-block ${cssBaseClassName}_text-small`}>
              {organisation}
            </span>
          )}
          <span className={`d-block ${cssBaseClassName}_text-small text-break`}>
            <Trans
              t={t}
              i18nKey="user_account_menu_notification_email"
              values={{ email }}
            ></Trans>
          </span>
        </>
      }

      {email !== nichandle && (
        <span className={`d-block ${cssBaseClassName}_text-small`}>
          {nichandle}
        </span>
      )}
    </p>
  );
};

export default UserDetails;
