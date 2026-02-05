import { BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { ActionMenuItemProps } from '@/components/action-menu/ActionMenu.props';
import { Button } from '@/components/button/Button.component';
import { Link } from '@/components/link/Link.component';

export const ActionMenuItem = ({
  id,
  item,
  closeMenu,
}: {
  id: number;
  item: Omit<ActionMenuItemProps, 'id'>;
  closeMenu: () => void;
}) => {
  const buttonProps = {
    ...item,
    size: BUTTON_SIZE.sm,
    variant: BUTTON_VARIANT.ghost,
    displayTooltip: false,
    className: 'menu-item-button w-full',
    disabled: item.isDisabled,
    loading: item.isLoading,
    onClick: () => {
      item.onClick?.();
      closeMenu();
    },
  };

  if (item.href) {
    return (
      <Link
        type={item.linktype}
        href={item.href}
        download={item.download}
        target={item.target}
        urn={item.urn}
        iamActions={item.iamActions}
        onClick={buttonProps.onClick}
        disabled={item.isDisabled}
      >
        {item.label}
      </Link>
    );
  }

  if (item.isDisabled) {
    delete buttonProps.isDisabled;
  }

  if (item.isLoading) {
    delete buttonProps.isLoading;
  }

  return (
    <Button id={id?.toString()} {...buttonProps}>
      {item.label}
    </Button>
  );
};
