import React from 'react';

export type MessageOptions = {
  veeamBackupId?: string;
  linkUrl?: string;
  linkLabel?: string;
};

export type MessageData = {
  id: number;
  options?: MessageOptions;
  message: string;
};

export type MessagesContextType = {
  addSuccessMessage: (msg: string, options?: MessageOptions) => void;
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
