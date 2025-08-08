import React from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  POPOVER_POSITION,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import './translations/translation';

import { MenuItem } from './menu-item';
import { ActionMenuProps } from './ActionMenu.props';
import './action-menu.scss';

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
}) => {
  const { t } = useTranslation('action-menu');
  const [isTrigger, setIsTrigger] = React.useState(false);

  return (
    <Popover position={popoverPosition}>
      <PopoverTrigger asChild>
        <Button
          loading={isLoading}
          variant={variant}
          disabled={isDisabled}
          size={BUTTON_SIZE.sm}
          onClick={() => setIsTrigger(true)}
        >
          {displayIcon && (
            <Icon
              name={
                icon ||
                (isCompact ? ICON_NAME.ellipsisVertical : ICON_NAME.chevronDown)
              }
            />
          )}
          {!isCompact && (label || t('common_actions'))}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="menu-item-ul">
          {items.map(({ id, ...item }) => (
            <li key={id}>
              <MenuItem id={id} key={id} item={item} isTrigger={isTrigger} />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ActionMenu;
