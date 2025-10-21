import { MESSAGE_COLOR, MESSAGE_VARIANT } from '@ovhcloud/ods-react';

export type ActionBannerProps = {
  message: string;
  label?: string;
  variant?: MESSAGE_VARIANT;
  color?: MESSAGE_COLOR;
  onClick?: () => void;
  href?: string;
  className?: string;
  dismissible?: boolean;
};
