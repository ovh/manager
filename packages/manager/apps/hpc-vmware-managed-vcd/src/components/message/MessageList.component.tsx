import React from 'react';
import { useMessageContext } from '@/context/Message.context';
import { Message } from './Message.component';

export const MessageList: React.FC = () => {
  const { messages } = useMessageContext();

  return (
    <>
      {messages.map((message) => (
        <Message key={message.uid} message={message} />
      ))}
    </>
  );
};
