import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { NotificationType } from '@ovh-ux/manager-react-components';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { MessageType, useMessageContext } from '@/context/Message.context';

type MessageProps = {
  message: MessageType;
};

const messageColors = {
  [NotificationType.Success]: ODS_MESSAGE_TYPE.success,
  [NotificationType.Error]: ODS_MESSAGE_TYPE.error,
  [NotificationType.Warning]: ODS_MESSAGE_TYPE.warning,
  [NotificationType.Info]: ODS_MESSAGE_TYPE.info,
};
const textColors = {
  [NotificationType.Success]: ODS_TEXT_COLOR_INTENT.success,
  [NotificationType.Error]: ODS_TEXT_COLOR_INTENT.error,
  [NotificationType.Warning]: ODS_TEXT_COLOR_INTENT.warning,
  [NotificationType.Info]: ODS_TEXT_COLOR_INTENT.info,
};

const getMessageColor = (type: NotificationType) =>
  messageColors[type] || ODS_MESSAGE_TYPE.info;

const getTextColor = (type: NotificationType) =>
  textColors[type] || ODS_TEXT_COLOR_INTENT.info;

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
      type={getMessageColor(type)}
      {...(persistent
        ? {}
        : {
            removable: true,
            onOdsRemoveClick: () => clearMessage(uid),
          })}
    >
      <OsdsText
        color={getTextColor(type)}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {content}
      </OsdsText>
    </OsdsMessage>
  );
};
