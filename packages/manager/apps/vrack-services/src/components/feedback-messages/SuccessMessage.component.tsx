import React from 'react';
import {
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useVrackServicesList } from '@ovh-ux/manager-network-common';
import { MessageData, MessagesContext } from './Messages.context';

export const SuccessMessage: React.FC<Partial<MessageData>> = ({
  id,
  message,
  options,
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
        className="block"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {message}
      </OsdsText>
      {options?.linkLabel && options?.linkUrl && (
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={options.linkUrl}
          className="ml-3"
          target={OdsHTMLAnchorElementTarget._blank}
        >
          {options.linkLabel}
        </OsdsLink>
      )}
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
