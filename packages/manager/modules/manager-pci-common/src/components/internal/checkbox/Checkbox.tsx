import { ComponentProps } from 'react';
import icons from '@ovhcloud/ods-common-theming/icons/icons.data.json';
import clsx from 'clsx';
import './style.scss';

/**
 * This is a copy of ODS 18 checkbox style
 * TODO: remove when migrating
 */
export const CheckboxControl = ({
  className,
  ...checkboxProps
}: Exclude<ComponentProps<'input'>, 'type'>) => (
  <span
    className="pci-ods-checkbox"
    style={{
      // react doesn't accept variables
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      '--icon-mask-check': `url("${icons.check}")`,
      '--icon-mask-minus': `url("${icons.minus}")`,
    }}
  >
    <input
      type="checkbox"
      {...checkboxProps}
      className={clsx('pci-ods-checkbox__checkbox', className)}
    />
  </span>
);
