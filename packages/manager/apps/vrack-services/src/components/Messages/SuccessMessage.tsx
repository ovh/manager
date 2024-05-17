import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { MessageData, MessagesContext } from './Messages.context';
import { useVrackServicesList } from '@/api';

export const SuccessMessage: React.FC<Partial<MessageData>> = ({
  id,
  message,
}) => {
  const { hideMessage } = React.useContext(MessagesContext);
  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.success}
      className="mb-8"
      removable
      onOdsRemoveClick={() => id && hideMessage(id)}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {message}
      </OsdsText>
    </OsdsMessage>
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
          ({ id: messageId, vrackServicesId }) =>
            !hiddenMessages.includes(messageId) &&
            (!id || vrackServicesId === id),
        )
        .map((msg) => (
          <SuccessMessage key={msg.id} {...msg} />
        ))}
    </>
  );
};
