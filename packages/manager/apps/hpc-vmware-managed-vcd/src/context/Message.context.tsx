import { NotificationType } from '@ovh-ux/manager-react-components/src/components/notifications/useNotifications';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

export type MessageType = {
  uid: number;
  content: ReactNode;
  type: NotificationType;
  persistent?: boolean;
  includedSubRoutes?: string[];
  excludedSubRoutes?: string[];
  duration?: number;
};

type AddMessageProps = Omit<MessageType, 'uid'>;
type AddSpecificMessageProps = Omit<AddMessageProps, 'type'>;

export type MessageContextType = {
  messages: MessageType[];
  addSuccess: (props: AddSpecificMessageProps) => void;
  addError: (props: AddSpecificMessageProps) => void;
  addWarning: (props: AddSpecificMessageProps) => void;
  addInfo: (props: AddSpecificMessageProps) => void;
  clearMessage: (uid: number) => void;
  clearMessages: () => void;
};

const MessageContext = createContext<MessageContextType>({
  messages: [],
  addSuccess: () => null,
  addError: () => null,
  addWarning: () => null,
  addInfo: () => null,
  clearMessage: () => null,
  clearMessages: () => null,
});

export const MessageContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const addMessage = (props: AddMessageProps) => {
    setMessages((prevList) => [
      ...prevList,
      {
        uid: Date.now(),
        includedSubRoutes: props.includedSubRoutes || [],
        excludedSubRoutes: props.excludedSubRoutes || [],
        ...props,
      },
    ]);
  };
  const deleteMessage = (id: number) => {
    setMessages((prevList) => prevList.filter((msg) => msg.uid !== id));
  };

  const messageContextValue: MessageContextType = useMemo(
    () => ({
      messages,
      addSuccess: (props: AddSpecificMessageProps) =>
        addMessage({ type: NotificationType.Success, ...props }),
      addError: (props: AddSpecificMessageProps) =>
        addMessage({ type: NotificationType.Error, ...props }),
      addInfo: (props: AddSpecificMessageProps) =>
        addMessage({ type: NotificationType.Info, ...props }),
      addWarning: (props: AddSpecificMessageProps) =>
        addMessage({ type: NotificationType.Warning, ...props }),
      clearMessage: (id) => deleteMessage(id),
      clearMessages: () => setMessages([]),
    }),
    [messages],
  );

  return (
    <MessageContext.Provider value={messageContextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error(
      'useMessageContext must be used within a MessageContextProvider',
    );
  }
  return context;
};
