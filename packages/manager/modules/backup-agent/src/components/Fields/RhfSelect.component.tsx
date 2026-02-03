import React, { ComponentProps } from 'react';

import { OdsSelect } from '@ovhcloud/ods-components/react';

import { useRhfFieldContext } from './RhfField.context';

export function RhfSelect(props: Readonly<Omit<ComponentProps<typeof OdsSelect>, 'id' | 'name'>>) {
  const {
    id,
    controller: {
      field,
      fieldState: { error },
    },
  } = useRhfFieldContext();

  return (
    <OdsSelect
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
