import React from 'react';
import { useMessageContext } from '@/context/Message.context';
import { Message } from './Message.component';

export const MessageList: React.FC = () => {
  const { messages } = useMessageContext();

  return (
    <div className="flex flex-col">
      {messages.map((message) => (
        <Message key={message.uid} message={message} />
      ))}
    </div>
  );
};
