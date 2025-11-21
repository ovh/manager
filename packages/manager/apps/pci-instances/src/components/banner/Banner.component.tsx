import { FC, PropsWithChildren } from 'react';
import {
  Message,
  MessageIcon,
  ICON_NAME,
  MessageBody,
  MessageProp,
} from '@ovhcloud/ods-react';

type TBannerProps = PropsWithChildren<MessageProp>;

const Banner: FC<TBannerProps> = ({ children, color, ...props }) => {
  const icon =
    color === 'warning' ? ICON_NAME.triangleExclamation : ICON_NAME.circleInfo;

  return (
    <Message color={color} dismissible={false} {...props}>
      <MessageIcon name={icon} />
      <MessageBody>{children}</MessageBody>
    </Message>
  );
};

export default Banner;
