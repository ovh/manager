import { BUTTON_VARIANT, ICON_NAME } from '@ovh-ux/muk';

export type ToolbarAction = {
  id: string;
  label: string;
  link: string;
  isExternal?: boolean;
  variant?: BUTTON_VARIANT;
  isDisabled?: boolean;
  icon?: ICON_NAME;
};
