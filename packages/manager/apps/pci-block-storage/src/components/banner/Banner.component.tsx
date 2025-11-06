import { PropsWithChildren, useState } from 'react';
import {
  IconName,
  Message,
  MessageBody,
  MessageIcon,
  MessageProp,
} from '@ovhcloud/ods-react';

type BannerProps = PropsWithChildren<
  {
    iconName?: IconName;
  } & MessageProp
>;

export const Banner = ({
  iconName,
  children,
  onRemove,
  dismissible = false,
  ...messageProps
}: BannerProps) => {
  const [displayBanner, setDisplayBanner] = useState(true);

  const handleRemove = () => {
    onRemove?.();
    if (dismissible) setDisplayBanner(false);
  };

  if (!displayBanner) return null;

  return (
    <Message
      dismissible={dismissible}
      onRemove={handleRemove}
      {...messageProps}
    >
      {iconName && <MessageIcon name={iconName} />}
      <MessageBody>{children}</MessageBody>
    </Message>
  );
};
