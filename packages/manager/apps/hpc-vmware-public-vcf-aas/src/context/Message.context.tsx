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

export type MessageColor = OdsMessageColor;

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
  addMessage: (props: AddGenericMessageProps) => number;
  addSuccess: (props: AddMessageProps) => number;
  addError: (props: AddMessageProps) => number;
  addWarning: (props: AddMessageProps) => number;
  addInfo: (props: AddMessageProps) => number;
  addCritical: (props: AddMessageProps) => number;
  clearMessage: (uid: number) => void;
  clearMessages: () => void;
};

const MessageContext = createContext<MessageContextType>({
  messages: [],
  addMessage: () => null,
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
    const uid = Date.now();
    setMessages((prevList) => [
      ...prevList,
      {
        uid,
        includedSubRoutes: props.includedSubRoutes || [],
        excludedSubRoutes: props.excludedSubRoutes || [],
        ...props,
      },
    ]);
    return uid;
  };
  const deleteMessage = (id: number) => {
    setMessages((prevList) => prevList.filter((msg) => msg.uid !== id));
  };

  const messageContextValue: MessageContextType = useMemo(
    () => ({
      messages,
      addMessage,
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
