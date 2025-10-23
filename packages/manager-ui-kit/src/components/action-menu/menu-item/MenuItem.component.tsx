import { BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { Link } from '../../Link';
import { Button } from '../../button';
import { ActionMenuItem } from '../ActionMenu.props';

export const MenuItem = ({
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
