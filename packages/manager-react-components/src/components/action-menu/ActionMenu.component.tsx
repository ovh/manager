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
  Link,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import './translations/translation';

import { ManagerButton } from '../ManagerButton/ManagerButton';
import { ActionMenuItem, ActionMenuProps } from './ActionMenu.props';
import './action-menu.scss';

const MenuItem = ({
  item,
  isTrigger,
  id,
}: {
  item: Omit<ActionMenuItem, 'id'>;
  isTrigger: boolean;
  id: number;
}) => {
  const buttonProps = {
    size: BUTTON_SIZE.sm,
    variant: BUTTON_VARIANT.ghost,
    displayTooltip: false,
    className: 'menu-item-button w-full',
    ...item,
  };

  if (item.href) {
    return (
      <Link href={item.href} download={item.download} target={item.target}>
        {item.label}
      </Link>
    );
  }

  return !item?.iamActions || item?.iamActions?.length === 0 ? (
    <Button {...buttonProps}>{item.label}</Button>
  ) : (
    <ManagerButton id={`${id}`} isIamTrigger={isTrigger} {...buttonProps} />
  );
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  isCompact = false,
  icon,
  variant = BUTTON_VARIANT.outline,
  isDisabled = false,
  isLoading = false,
  popoverPosition = POPOVER_POSITION.bottom,
  label,
}) => {
  const { t } = useTranslation('buttons');
  const [isTrigger, setIsTrigger] = React.useState(false);

  return (
    <Popover position={popoverPosition}>
      <PopoverTrigger asChild>
        <Button
          data-testid="navigation-action-trigger-action"
          loading={isLoading}
          variant={variant}
          disabled={isDisabled}
          size={BUTTON_SIZE.sm}
          onClick={() => setIsTrigger(true)}
        >
          <Icon
            name={
              icon ||
              (isCompact ? ICON_NAME.ellipsisVertical : ICON_NAME.chevronDown)
            }
          />
          {!isCompact && (label || t('common_actions'))}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="menu-item-ul">
          {items.map(({ id, onClick, ...item }) => (
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
