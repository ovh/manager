import { ComponentProps } from 'react';
import clsx from 'clsx';
import '@ovhcloud/ods-components/dist/collection/components/radio/src/components/ods-radio/ods-radio.css';

/**
 * This component uses ods style but doesn't use ODS components because it is not compatible with HTML input properties
 */
export const RadioControl = ({
  className,
  ...radioProps
}: Exclude<ComponentProps<'input'>, 'type'>) => (
  <span className="ods-radio">
    <input
      type="radio"
      {...radioProps}
      className={clsx(
        'ods-radio__radio',
        'invalid:border-[--ods-color-form-element-border-critical]',
        className,
      )}
    />
  </span>
);
