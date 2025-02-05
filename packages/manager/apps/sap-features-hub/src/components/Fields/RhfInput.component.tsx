import { OdsInput } from '@ovhcloud/ods-components/react';
import React, { ComponentProps } from 'react';
import { useRhfFieldContext } from './RhfField.context';

export function RhfInput(
  props: Readonly<Omit<ComponentProps<typeof OdsInput>, 'id' | 'name'>>,
) {
  const {
    id,
    controller: { field, fieldState },
  } = useRhfFieldContext();

  return (
    <OdsInput
      id={id}
      {...props}
      {...field}
      hasError={fieldState.isDirty && !!fieldState.error}
      onOdsBlur={field.onBlur}
      onOdsChange={field.onChange}
    />
  );
}
