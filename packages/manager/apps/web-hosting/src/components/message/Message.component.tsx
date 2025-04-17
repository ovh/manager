import React from 'react';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { MessageType, useMessageContext } from '@/context/Message.context';

type MessageProps = {
  message: MessageType;
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { clearMessage } = useMessageContext();
  const { content, uid, type = 'information', isDismissible = true } = message;

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
