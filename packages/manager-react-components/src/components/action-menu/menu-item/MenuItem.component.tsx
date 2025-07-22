import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { Link } from '../../Link';
import { ActionMenuItem } from '../ActionMenu.props';
import { ManagerButton } from '../../ManagerButton/ManagerButton';

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
        href={item.href}
        download={item.download}
        target={item.target}
        urn={item.urn}
        iamActions={item.iamActions}
      >
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
