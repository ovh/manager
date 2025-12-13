import { ButtonVariant, IconName } from '@ovhcloud/ods-react';

export type ToolbarAction = {
  id: string;
  label: string;
  link: string;
  isExternal?: boolean;
  variant?: ButtonVariant;
  isDisabled?: boolean;
  icon?: IconName;
};
