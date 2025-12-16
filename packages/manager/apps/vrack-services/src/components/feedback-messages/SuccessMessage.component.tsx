import React from 'react';
import {
  MESSAGE_COLOR,
  Link,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useVrackServicesList } from '@ovh-ux/manager-network-common';
import { MessageData, MessagesContext } from './Messages.context';

export const SuccessMessage: React.FC<Partial<MessageData>> = ({
  id,
  message,
  options,
}) => {
  const { hideMessage } = React.useContext(MessagesContext);
  return (
    <Message
      color={MESSAGE_COLOR.success}
      dismissible
      onRemove={() => id && hideMessage(id)}
    >
      <MessageIcon name="circle-check" />
      <MessageBody>
        {message}
        {options?.linkLabel && options?.linkUrl && (
          <Link href={options.linkUrl} className="ml-3" target="_blank">
            {options.linkLabel}
          </Link>
        )}
      </MessageBody>
    </Message>
  );
};

export const SuccessMessages: React.FC<{ id?: string }> = ({ id }) => {
  const vrackServicesList = useVrackServicesList();
  const { successMessages, hiddenMessages } = React.useContext(MessagesContext);

  if (vrackServicesList?.data?.data?.length === 0) {
    return null;
  }

  return (
    <>
      {successMessages
        .filter(
          ({ id: messageId, options }) =>
            !hiddenMessages.includes(messageId) &&
            (!id || options?.vrackServicesId === id),
        )
        .map((msg) => (
          <SuccessMessage key={msg.id} {...msg} />
        ))}
    </>
  );
};
