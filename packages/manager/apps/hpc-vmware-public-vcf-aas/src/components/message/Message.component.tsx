import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { OdsMessage } from '@ovhcloud/ods-components/react';

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
    type = 'information',
    isDismissible = true,
    includedSubRoutes = [],
    excludedSubRoutes = [],
    duration,
  } = message;

  useEffect(() => {
    if (
      !includedSubRoutes.every((route) => pathname.includes(route)) ||
      excludedSubRoutes.some((route) => pathname.includes(route))
    ) {
      clearMessage(uid);
    }
  }, [uid, includedSubRoutes, excludedSubRoutes, pathname, clearMessage]);

  useEffect(() => {
    if (!duration) return undefined;
    const durationTimeout = setTimeout(() => clearMessage(uid), duration);

    return () => clearTimeout(durationTimeout);
  }, [clearMessage, duration, uid]);

  return (
    <OdsMessage
      className="mb-2"
      color={type}
      isDismissible={isDismissible}
      onOdsRemove={isDismissible ? () => clearMessage(uid) : undefined}
    >
      {content}
    </OdsMessage>
  );
};
