import { ComponentProps } from 'react';
import clsx from 'clsx';
import './style.scss';

/**
 * This is a copy of ODS 18 radio style
 * TODO: remove when migrating
 */
export const RadioControl = ({
  className,
  ...radioProps
}: Exclude<ComponentProps<'input'>, 'type'>) => (
  <span className="pci-ods-radio">
    <input
      type="radio"
      {...radioProps}
      className={clsx('pci-ods-radio__radio', className)}
    />
  </span>
);
