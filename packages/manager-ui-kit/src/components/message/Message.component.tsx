import { Message as OdsMessage } from '@ovhcloud/ods-react';

import { MessageProps } from '@/components';

export const Message = ({ children, ...others }: MessageProps) => (
  <OdsMessage {...others}>{children}</OdsMessage>
);
