import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';

type TCartOptionDetailItemProps = {
  label: string;
  price?: string;
  unit?: string;
  className?: string;
};

const headingClassname = 'text-[--ods-color-heading]';

const CartOptionDetailItem: FC<TCartOptionDetailItemProps> = ({
  label,
  price,
  unit,
  className,
}) => (
  <div className={clsx('flex justify-between', className)}>
    <Text preset="heading-6" className={headingClassname}>
      {label}
    </Text>
    <div>
      {price && (
        <Text preset="heading-6" className="text-right">
          {price}
        </Text>
      )}
      {unit && <Text>{unit}</Text>}
    </div>
  </div>
);

export default CartOptionDetailItem;
