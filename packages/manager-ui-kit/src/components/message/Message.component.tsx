import { Message as OdsMessage } from '@ovhcloud/ods-react';

import { MessageProps } from '@/components/message/Message.props';

export const Message = ({ children, ...others }: MessageProps) => (
  <OdsMessage {...others}>{children}</OdsMessage>
);
