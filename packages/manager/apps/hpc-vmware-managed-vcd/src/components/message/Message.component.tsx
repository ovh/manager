import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { MessageType, useMessageContext } from '@/context/Message.context';

type MessageProps = {
  message: MessageType;
};

const textColors = {
  [ODS_MESSAGE_TYPE.success]: ODS_TEXT_COLOR_INTENT.success,
  [ODS_MESSAGE_TYPE.error]: ODS_TEXT_COLOR_INTENT.error,
  [ODS_MESSAGE_TYPE.warning]: ODS_TEXT_COLOR_INTENT.warning,
  [ODS_MESSAGE_TYPE.info]: ODS_TEXT_COLOR_INTENT.info,
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { pathname } = useLocation();
  const { clearMessage } = useMessageContext();
  const {
    content,
    uid,
    type = ODS_MESSAGE_TYPE.info,
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
      type={type}
      {...(persistent
        ? {}
        : {
            removable: true,
            onOdsRemoveClick: () => clearMessage(uid),
          })}
    >
      <OsdsText
        color={textColors[type] || ODS_TEXT_COLOR_INTENT.info}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {content}
      </OsdsText>
    </OsdsMessage>
  );
};
