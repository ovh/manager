import React from 'react';

import { useVrackServicesList } from '@ovh-ux/manager-network-common';

import { MessagesContext } from './Messages.context';
import { SuccessMessage } from './SuccessMessage.component';

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
            !hiddenMessages.includes(messageId) && (!id || options?.vrackServicesId === id),
        )
        .map((msg) => (
          <SuccessMessage key={msg.id} {...msg} />
        ))}
    </>
  );
};
