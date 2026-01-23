import React from 'react';

import { Link, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';

import { MessageData, MessagesContext } from './Messages.context';

export const SuccessMessage: React.FC<Partial<MessageData>> = ({ id, message, options }) => {
  const { hideMessage } = React.useContext(MessagesContext);
  return (
    <Message color={MESSAGE_COLOR.success} dismissible onRemove={() => id && hideMessage(id)}>
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
