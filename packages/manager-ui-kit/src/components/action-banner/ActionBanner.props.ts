import { MESSAGE_VARIANT, MESSAGE_COLOR } from '@ovhcloud/ods-react';

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
