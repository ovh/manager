import React from 'react';

export type MessageData = {
  id: number;
  vrackServicesId?: string;
  message: string;
};

export type MessagesContextType = {
  addSuccessMessage: (msg: string, vrackServicesId?: string) => void;
  successMessages: MessageData[];
  hiddenMessages: number[];
  hideMessage: (id: number) => void;
};

export const MessagesContext = React.createContext<MessagesContextType>({
  addSuccessMessage: () => undefined,
  successMessages: [],
  hiddenMessages: [],
  hideMessage: () => undefined,
});
