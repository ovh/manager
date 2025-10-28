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
    <OdsMessage
      className="mb-2"
      color={type}
      isDismissible={isDismissible}
      onOdsRemove={isDismissible ? () => clearMessage(uid) : null}
    >
      {content}
    </OdsMessage>
  );
};
