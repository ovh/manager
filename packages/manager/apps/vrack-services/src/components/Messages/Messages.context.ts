import React from 'react';

export type MessagesContextType = {
  hiddenMessages: number[];
  hideMessage: (submittedAt: number) => void;
};

export const MessagesContext = React.createContext<MessagesContextType>({
  hiddenMessages: [],
  hideMessage: () => undefined,
});
