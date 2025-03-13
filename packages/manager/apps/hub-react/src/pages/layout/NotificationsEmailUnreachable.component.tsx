import { FunctionComponent, useContext, useMemo, useState } from 'react';
import {
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Trans, useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const NotificationsEmailUnreachable: FunctionComponent = () => {
  const { t } = useTranslation('hub/notifications');
  const [notificationLink, setNotificationLink] = useState<string>();

  const {
    shell,
    environment: { user },
  } = useContext(ShellContext);

  const isEmailUnreachable = useMemo(
    () => user.certificates.includes('email-unreachable'),
    [user],
  );

  if (isEmailUnreachable) {
    shell.navigation.getURL('account', '/useraccount/infos', {}).then((url) => {
      setNotificationLink(url as string);
    });

    return (
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
                  target={OdsHTMLAnchorElementTarget._blank}
                ></OsdsLink>
              ),
            }}
          ></Trans>
        </OsdsText>
      </OsdsMessage>
    );
  }

  return <></>;
};

export default NotificationsEmailUnreachable;
