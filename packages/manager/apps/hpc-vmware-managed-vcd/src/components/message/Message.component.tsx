import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  getOdsNotificationMessageColor,
  getOdsNotificationTextColor,
} from '@ovh-ux/manager-react-components/src/components/notifications/ods-notification';
import { MessageType, useMessageContext } from '@/context/Message.context';

type MessageProps = {
  message: MessageType;
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { pathname } = useLocation();
  const { clearMessage } = useMessageContext();
  const {
    content,
    uid,
    type,
    persistent,
    includedSubRoutes,
    excludedSubRoutes,
    duration,
  } = message;

  useEffect(() => {
    if (
      !includedSubRoutes.every((route) => pathname.includes(route)) ||
      excludedSubRoutes.some((route) => pathname.includes(route))
    ) {
      clearMessage(uid);
    }
  }, [uid, includedSubRoutes, excludedSubRoutes, pathname]);

  useEffect(() => {
    if (!duration) return;
    const durationTimeout = setTimeout(() => clearMessage(uid), duration);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(durationTimeout);
  }, [duration]);

  return (
    <OsdsMessage
      className="mb-2"
      type={getOdsNotificationMessageColor(type)}
      {...(persistent
        ? {}
        : {
            removable: true,
            onOdsRemoveClick: () => clearMessage(uid),
          })}
    >
      <OsdsText
        color={getOdsNotificationTextColor(type)}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {content}
      </OsdsText>
    </OsdsMessage>
  );
};
