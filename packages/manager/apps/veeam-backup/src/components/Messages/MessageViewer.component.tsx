import React from 'react';
import { OdsLink, OdsMessage } from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  VeeamBackup,
  veeamBackupListQueryKey,
} from '@ovh-ux/manager-module-vcd-api';
import { MessageData, MessagesContext } from './Messages.context';

export const MessageViewer: React.FC<Partial<MessageData>> = ({
  id,
  message,
  options,
}) => {
  const { hideMessage } = React.useContext(MessagesContext);

  return (
    <OdsMessage
      color={options?.type || 'success'}
      isDismissible
      onOdsRemove={() => id && hideMessage(id)}
    >
      <div>
        {message}
        {options?.linkLabel && options?.linkUrl && (
          <OdsLink
            label={options.linkLabel}
            href={options.linkUrl}
            className="ml-3"
            target="_blank"
          />
        )}
      </div>
    </OdsMessage>
  );
};

export const MessagesViewer: React.FC<{ id?: string }> = ({ id }) => {
  const { messages, hiddenMessages } = React.useContext(MessagesContext);
  const queryClient = useQueryClient();
  const veeamBackupList = queryClient.getQueryData<{
    data: VeeamBackup[];
  }>(veeamBackupListQueryKey);

  if (veeamBackupList?.data?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      {messages
        .filter(
          ({ id: messageId, options }) =>
            !hiddenMessages.includes(messageId) &&
            (!id || options?.veeamBackupId === id),
        )
        .map((msg) => (
          <MessageViewer key={msg.id} {...msg} />
        ))}
    </div>
  );
};
