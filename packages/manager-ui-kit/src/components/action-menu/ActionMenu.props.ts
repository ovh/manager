import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_NAME,
  POPOVER_POSITION,
} from '@ovhcloud/ods-react';

import { LinkType } from '@/components/link/Link.props';

export interface ActionMenuItemProps {
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
  items: ActionMenuItemProps[];
  isCompact?: boolean;
  icon?: ICON_NAME;
  variant?: BUTTON_VARIANT;
  displayIcon?: boolean;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  popoverPosition?: POPOVER_POSITION;
  label?: string;
  size?: BUTTON_SIZE;
}
