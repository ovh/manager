import React from 'react';
import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
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
      className="mb-8"
      isDismissible
      onOdsRemove={() => id && hideMessage(id)}
    >
      <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
        {message}
      </OdsText>
      {options?.linkLabel && options?.linkUrl && (
        <OdsLink
          color={ODS_BUTTON_COLOR.primary}
          href={options.linkUrl}
          className="ml-3"
          target="_blank"
        >
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
