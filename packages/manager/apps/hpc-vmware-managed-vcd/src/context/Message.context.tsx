import { OdsMessageColor } from '@ovhcloud/ods-components';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

export type MessageOptions = {
  isDismissible?: boolean;
  includedSubRoutes?: string[];
  excludedSubRoutes?: string[];
  duration?: number;
};

export type MessageType = {
  uid: number;
  content: ReactNode;
  type: OdsMessageColor;
} & MessageOptions;

type AddGenericMessageProps = Omit<MessageType, 'uid'>;
type AddMessageProps = Omit<AddGenericMessageProps, 'type'>;

export type MessageContextType = {
  messages: MessageType[];
  addSuccess: (props: AddMessageProps) => void;
  addError: (props: AddMessageProps) => void;
  addWarning: (props: AddMessageProps) => void;
  addInfo: (props: AddMessageProps) => void;
  addCritical: (props: AddMessageProps) => void;
  clearMessage: (uid: number) => void;
  clearMessages: () => void;
};

const MessageContext = createContext<MessageContextType>({
  messages: [],
  addSuccess: () => null,
  addError: () => null,
  addWarning: () => null,
  addInfo: () => null,
  addCritical: () => null,
  clearMessage: () => null,
  clearMessages: () => null,
});

export const MessageContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const addMessage = (props: AddGenericMessageProps) => {
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
      addSuccess: (props) => addMessage({ type: 'success', ...props }),
      addError: (props) => addMessage({ type: 'danger', ...props }),
      addInfo: (props) => addMessage({ type: 'information', ...props }),
      addWarning: (props) => addMessage({ type: 'warning', ...props }),
      addCritical: (props) => addMessage({ type: 'critical', ...props }),
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
