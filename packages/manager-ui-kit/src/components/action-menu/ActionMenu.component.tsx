import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { ActionMenuProps } from '@/components/action-menu/ActionMenu.props';
import { ActionMenuItem } from '@/components/action-menu/action-menu-item/ActionMenuItem.component';

import './action-menu.scss';
import './translations/translation';

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  isCompact = false,
  icon,
  variant = BUTTON_VARIANT.outline,
  isDisabled = false,
  isLoading = false,
  displayIcon = true,
  popoverPosition = POPOVER_POSITION.bottom,
  label,
  size = BUTTON_SIZE.sm,
}) => {
  const { t } = useTranslation('action-menu');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Popover
      position={popoverPosition}
      open={isMenuOpen}
      onOpenChange={(detail) => setIsMenuOpen(detail?.open ?? false)}
    >
      <PopoverTrigger asChild>
        <Button
          loading={isLoading}
          variant={variant}
          disabled={isDisabled}
          size={size}
          onClick={() => setIsMenuOpen(true)}
        >
          {displayIcon && (
            <Icon name={icon || (isCompact ? ICON_NAME.ellipsisVertical : ICON_NAME.chevronDown)} />
          )}
          {!isCompact && (label || t('common_actions'))}
        </Button>
      </PopoverTrigger>
      <PopoverContent withArrow>
        <ul className="menu-item-ul">
          {items.map(({ id, ...item }) => (
            <li key={id}>
              <ActionMenuItem id={id} key={id} item={item} closeMenu={() => setIsMenuOpen(false)} />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ActionMenu;
