import {
  POPOVER_POSITION,
  BUTTON_VARIANT,
  BUTTON_COLOR,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { LinkType } from '../Link';

export interface ActionMenuItem {
  id: number;
  rel?: string;
  href?: string;
  download?: string;
  target?: string;
  onClick?: () => void;
  label: string;
  variant?: BUTTON_VARIANT;
  iamActions?: string[];
  urn?: string;
  className?: string;
  linktype?: LinkType;
  isDisabled?: boolean;
  isLoading?: boolean;
  color?: BUTTON_COLOR;
  'data-testid'?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  isCompact?: boolean;
  icon?: ICON_NAME;
  variant?: BUTTON_VARIANT;
  displayIcon?: boolean;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  popoverPosition?: POPOVER_POSITION;
  label?: string;
}
