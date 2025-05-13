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

export const MessageContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [successMessages, setSuccessMessages] = React.useState<MessageData[]>(
    [],
  );
  const [hiddenMessages, setHiddenMessages] = React.useState<number[]>([]);

  const messageContext = React.useMemo(
    () => ({
      successMessages,
      hiddenMessages,
      addSuccessMessage: (message: string, options?: MessageOptions) => {
        setSuccessMessages((messageList) =>
          messageList.concat({ id: Date.now(), message, options }),
        );
      },
      hideMessage: (id: number) => {
        setHiddenMessages((hiddenMessage) => hiddenMessage.concat(id));
      },
    }),
    [successMessages, hiddenMessages],
  );

  return (
    <MessagesContext.Provider value={messageContext}>
      {children}
    </MessagesContext.Provider>
  );
};
