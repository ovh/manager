import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';

type TCartOptionDetailItemProps = {
  label: string;
  price?: string;
  priceUnit?: string;
  className?: string;
};

const headingClassname = 'text-[--ods-color-heading]';

const CartOptionDetailItem: FC<TCartOptionDetailItemProps> = ({
  label,
  price,
  priceUnit,
  className,
}) => (
  <div className={clsx('flex justify-between', className)}>
    <Text preset="heading-6" className={headingClassname}>
      {label}
    </Text>
    {price && (
      <div className="flex flex-col items-end">
        <Text preset="heading-6" className={headingClassname}>
          {price}
        </Text>
        {priceUnit && <Text>{priceUnit}</Text>}
      </div>
    )}
  </div>
);

export default CartOptionDetailItem;
