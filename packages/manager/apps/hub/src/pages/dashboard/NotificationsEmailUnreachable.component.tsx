import { FunctionComponent, Suspense, useContext, useMemo } from 'react';

import { Await } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsLink, OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { USER_CERTIFICATES } from './dashboard.constants';

export const NotificationsEmailUnreachable: FunctionComponent = () => {
  const { t } = useTranslation('hub/notifications');

  const {
    shell: { navigation },
    environment: { user },
  } = useContext(ShellContext);

  const isEmailUnreachable = useMemo(
    () => user.certificates.includes(USER_CERTIFICATES.EMAIL_UNREACHABLE),
    [user],
  );

  const notificationLinkAsync = useMemo(
    () =>
      navigation.getURL('dedicated', '#/useraccount/infos', {
        fieldToFocus: 'ovh_form_content_contact',
      }),
    [],
  );

  if (isEmailUnreachable) {
    return (
      <Suspense>
        <Await
          resolve={notificationLinkAsync}
          children={(notificationLink: string) => (
            <OsdsMessage
              className="rounded mt-5"
              role="alert"
              color={ODS_TEXT_COLOR_INTENT.warning}
              type={ODS_MESSAGE_TYPE.warning}
              data-testid="email_unreachable_notifications"
            >
              <OsdsText level={ODS_TEXT_LEVEL.body} size={ODS_TEXT_SIZE._500}>
                <Trans
                  t={t}
                  i18nKey={'email_unreachable_notifications_description'}
                  components={{
                    anchor: (
                      <OsdsLink
                        href={notificationLink}
                        color={ODS_THEME_COLOR_INTENT.primary}
                        target={OdsHTMLAnchorElementTarget._parent}
                      ></OsdsLink>
                    ),
                  }}
                ></Trans>
              </OsdsText>
            </OsdsMessage>
          )}
        />
      </Suspense>
    );
  }

  return <></>;
};

export default NotificationsEmailUnreachable;
