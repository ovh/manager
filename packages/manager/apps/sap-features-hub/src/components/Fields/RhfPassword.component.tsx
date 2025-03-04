import { OdsPassword } from '@ovhcloud/ods-components/react';
import React, { ComponentProps } from 'react';
import { useRhfFieldContext } from './RhfField.context';

export function RhfPassword({
  className,
  ...rest
}: Readonly<Omit<ComponentProps<typeof OdsPassword>, 'name' | 'id'>>) {
  const {
    id,
    controller: {
      field,
      fieldState: { error },
    },
  } = useRhfFieldContext();

  return (
    <OdsPassword
      id={id}
      {...rest}
      {...field}
      className={`w-full ${className}`}
      hasError={!!error}
      onOdsBlur={field.onBlur}
      onOdsChange={field.onChange}
    />
  );
}
