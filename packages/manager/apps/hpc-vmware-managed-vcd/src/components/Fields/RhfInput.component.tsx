import { OdsInput } from '@ovhcloud/ods-components/react';
import React, { ComponentProps } from 'react';
import { useRhfFieldContext } from './RhfField.context';

export function RhfInput(
  props: Readonly<Omit<ComponentProps<typeof OdsInput>, 'id' | 'name'>>,
) {
  const {
    id,
    controller: {
      field,
      fieldState: { error },
    },
  } = useRhfFieldContext();

  return (
    <OdsInput
      id={id}
      {...props}
      {...field}
      aria-describedby={`helper-${id}`}
      hasError={!!error}
      onOdsBlur={field.onBlur}
      onOdsChange={field.onChange}
    />
  );
}
