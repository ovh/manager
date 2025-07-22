import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BUTTON_COLOR,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';

export interface ActionMenuItem {
  id: number;
  rel?: string;
  href?: string;
  download?: string;
  target?: string;
  onClick?: () => void;
  label: string;
  variant?: ODS_BUTTON_VARIANT;
  iamActions?: string[];
  urn?: string;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  color?: ODS_BUTTON_COLOR;
  'data-testid'?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  isCompact?: boolean;
  icon?: ODS_ICON_NAME;
  variant?: ODS_BUTTON_VARIANT;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  popoverPosition?: ODS_POPOVER_POSITION;
  label?: string;
}
