import { PropsWithChildren } from 'react';

import { MessageBody as ODSMessageBody } from '@ovhcloud/ods-react';

import { MessageBodyProps } from './MessageBody.props';

export const MessageBody = ({ children, ...props }: PropsWithChildren<MessageBodyProps>) => (
  <ODSMessageBody {...props}>{children}</ODSMessageBody>
);
