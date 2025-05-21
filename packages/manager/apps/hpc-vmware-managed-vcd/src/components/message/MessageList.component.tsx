import React from 'react';
import { useMessageContext } from '@/context/Message.context';
import { Message } from './Message.component';

type Props = { className?: string };

export const MessageList: React.FC<Props> = ({ className = '' }) => {
  const { messages } = useMessageContext();

  return (
    <div className={`flex flex-col ${className}`}>
      {messages.map((message) => (
        <Message key={message.uid} message={message} />
      ))}
    </div>
  );
};
