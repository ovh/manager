import React from 'react';
import { OdsMessage } from '@ovhcloud/ods-components/react';

interface NotificationProps {
  readonly label: string;
  readonly message: string;
  readonly removeMessage: () => void;
}

export default function Notification({
  label,
  message,
  removeMessage,
}: NotificationProps) {
  return (
    <OdsMessage
      color={label as 'information' | 'success' | 'warning'}
      className="mb-4 w-full"
      onOdsRemove={removeMessage}
    >
      {message}
    </OdsMessage>
  );
}
