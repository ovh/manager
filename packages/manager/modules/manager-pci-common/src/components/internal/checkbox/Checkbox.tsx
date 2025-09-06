import { ComponentProps } from 'react';
import clsx from 'clsx';
import '@ovhcloud/ods-components/dist/collection/components/checkbox/src/components/ods-checkbox/ods-checkbox.css';

/**
 * This component uses ods style but doesn't use ODS components because it is not compatible with HTML input properties
 */
export const CheckboxControl = ({
  className,
  ...checkboxProps
}: Exclude<ComponentProps<'input'>, 'type'>) => (
  <span className="ods-checkbox">
    <input
      type="checkbox"
      {...checkboxProps}
      className={clsx(
        'ods-checkbox__checkbox',
        'invalid:border-[--ods-color-form-element-border-critical]',
        className,
      )}
    />
  </span>
);
