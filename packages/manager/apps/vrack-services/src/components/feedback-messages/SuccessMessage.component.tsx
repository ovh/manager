import React from 'react';
import { OdsLink, OdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { useVrackServicesList } from '@ovh-ux/manager-network-common';
import { MessageData, MessagesContext } from './Messages.context';

export const SuccessMessage: React.FC<Partial<MessageData>> = ({
  id,
  message,
  options,
}) => {
  const { hideMessage } = React.useContext(MessagesContext);
  return (
    <OdsMessage
      color={ODS_MESSAGE_COLOR.success}
      className="block mb-8"
      isDismissible
      onOdsRemove={() => id && hideMessage(id)}
    >
      {message}
      {options?.linkLabel && options?.linkUrl && (
        <OdsLink href={options.linkUrl} className="ml-3" target="_blank">
          {options.linkLabel}
        </OdsLink>
      )}
    </OdsMessage>
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
