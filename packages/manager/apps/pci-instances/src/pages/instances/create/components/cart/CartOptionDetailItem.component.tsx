import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';

type TCartOptionDetailItemProps = {
  label: string;
  price?: string;
  className?: string;
};

const headingClassname = 'text-[--ods-color-heading]';

const CartOptionDetailItem: FC<TCartOptionDetailItemProps> = ({
  label,
  price,
  className,
}) => (
  <div className={clsx('flex justify-between', className)}>
    <Text preset="heading-6" className={headingClassname}>
      {label}
    </Text>
    {price && (
      <Text preset="heading-6" className={headingClassname}>
        {price}
      </Text>
    )}
  </div>
);

export default CartOptionDetailItem;
