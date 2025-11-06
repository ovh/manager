import { BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { ActionMenuItemProps } from '@/components/action-menu/ActionMenu.props';
import { Button } from '@/components/button/Button.component';
import { Link } from '@/components/link/Link.component';

export const ActionMenuItem = ({
  item,
  isTrigger,
  id,
}: {
  item: Omit<ActionMenuItemProps, 'id'>;
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
      <Link
        type={item.linktype}
        href={item.href}
        download={item.download}
        target={item.target}
        urn={item.urn}
        iamActions={item.iamActions}
        onClick={item.onClick}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Button id={`${id}`} isIamTrigger={isTrigger} {...buttonProps}>
      {item.label}
    </Button>
  );
};
