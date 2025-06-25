import React from 'react';

export type MessageType =
  | 'critical'
  | 'danger'
  | 'information'
  | 'success'
  | 'warning';

export type MessageOptions = {
  // TODO: Consider replacing veeamBackupId with a more generic identifier ( contextId or ...) for reusability
  veeamBackupId?: string;
  linkUrl?: string;
  linkLabel?: string;
  type?: MessageType;
  // TODO:  Consider allowing injection of a JSX !!
};

export type MessageData = {
  id: number;
  options?: MessageOptions;
  message: string;
};

export type MessagesContextType = {
  addMessage: (msg: string, options?: MessageOptions) => void;
  addSuccessMessage: (
    msg: string,
    options?: Omit<MessageOptions, 'type'>,
  ) => void;
  addDangerMessage: (
    msg: string,
    options?: Omit<MessageOptions, 'type'>,
  ) => void;
  addCriticalMessage: (
    msg: string,
    options?: Omit<MessageOptions, 'type'>,
  ) => void;
  addInformationMessage: (
    msg: string,
    options?: Omit<MessageOptions, 'type'>,
  ) => void;
  addWarningMessage: (
    msg: string,
    options?: Omit<MessageOptions, 'type'>,
  ) => void;
  messages: MessageData[];
  hiddenMessages: number[];
  hideMessage: (id: number) => void;
};

export const MessagesContext = React.createContext<MessagesContextType>({
  addMessage: () => undefined,
  addSuccessMessage: () => undefined,
  addDangerMessage: () => undefined,
  addCriticalMessage: () => undefined,
  addInformationMessage: () => undefined,
  addWarningMessage: () => undefined,
  messages: [],
  hiddenMessages: [],
  hideMessage: () => undefined,
});

export const MessageContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [messages, setMessages] = React.useState<MessageData[]>([]);
  const [hiddenMessages, setHiddenMessages] = React.useState<number[]>([]);

  const addMessage = React.useCallback(
    (message: string, options?: MessageOptions) => {
      setMessages((prev) =>
        prev.concat({
          id: Date.now(),
          message,
          options: {
            type: options?.type || 'success',
            ...options,
          },
        }),
      );
    },
    [],
  );

  const createTypeHandler = (type: MessageType) => {
    return (msg: string, options?: Omit<MessageOptions, 'type'>) => {
      addMessage(msg, { ...options, type });
    };
  };

  const messageContext: MessagesContextType = React.useMemo(
    () => ({
      messages,
      hiddenMessages,
      addMessage,
      addSuccessMessage: createTypeHandler('success'),
      addDangerMessage: createTypeHandler('danger'),
      addCriticalMessage: createTypeHandler('critical'),
      addInformationMessage: createTypeHandler('information'),
      addWarningMessage: createTypeHandler('warning'),
      hideMessage: (id: number) => {
        setHiddenMessages((prev) => prev.concat(id));
      },
    }),
    [messages, hiddenMessages, addMessage],
  );

  return (
    <MessagesContext.Provider value={messageContext}>
      {children}
    </MessagesContext.Provider>
  );
};
