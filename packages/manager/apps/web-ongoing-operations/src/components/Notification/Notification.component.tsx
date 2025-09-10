import React from 'react';
import { Message } from '@ovhcloud/ods-react';

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
    <Message
      color={label as 'information' | 'success' | 'warning'}
      className="mb-4 w-full"
      onRemove={removeMessage}
    >
      {message}
    </Message>
  );
}
