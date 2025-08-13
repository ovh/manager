import { ReactNode } from 'react';

export type MessageOptions = {
  isDismissible?: boolean;
  includedSubRoutes?: string[];
  excludedSubRoutes?: string[];
  duration?: number;
};

export type MessageType = {
  uid: number;
  content: ReactNode;
} & MessageOptions;

export type MessageProps = {
  message: MessageType;
};
