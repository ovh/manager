import { OdsInput } from '@ovhcloud/ods-components/react';
import React, { ComponentProps } from 'react';
import { useRhfFieldContext } from './RhfField.context';

export function RhfPassword({
  className,
  ...rest
}: Readonly<Omit<ComponentProps<typeof OdsInput>, 'name' | 'id'>>) {
  const {
    id,
    controller: { field },
  } = useRhfFieldContext();

  return (
    <OdsInput
      id={id}
      {...rest}
      {...field}
      isMasked
      className={`w-full ${className}`}
      onOdsBlur={field.onBlur}
      onOdsChange={field.onChange}
    />
  );
}
