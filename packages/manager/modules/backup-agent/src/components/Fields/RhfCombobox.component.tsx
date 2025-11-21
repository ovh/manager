import React, { ComponentProps } from 'react';

import { OdsCombobox } from '@ovhcloud/ods-components/react';

import { useRhfFieldContext } from './RhfField.context';

export function RhfCombobox(
  props: Readonly<Omit<ComponentProps<typeof OdsCombobox>, 'id' | 'name'>>,
) {
  const {
    id,
    controller: {
      field,
      fieldState: { error },
    },
  } = useRhfFieldContext();

  return (
    <OdsCombobox
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
