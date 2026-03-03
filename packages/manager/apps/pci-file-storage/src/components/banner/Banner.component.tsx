import React, { PropsWithChildren } from 'react';

import {
  ICON_NAME,
  Message,
  MessageBody,
  MessageIcon,
  type MessageProp,
} from '@ovhcloud/ods-react';

export type TBannerProps = PropsWithChildren<MessageProp>;

const Banner: React.FC<TBannerProps> = ({
  children,
  color,
  dismissible = false,
  onRemove,
  ...props
}) => {
  const icon = color === 'warning' ? ICON_NAME.triangleExclamation : ICON_NAME.circleInfo;

  return (
    <Message color={color} dismissible={dismissible} onRemove={onRemove} {...props}>
      <MessageIcon name={icon} />
      <MessageBody>{children}</MessageBody>
    </Message>
  );
};

export default Banner;
