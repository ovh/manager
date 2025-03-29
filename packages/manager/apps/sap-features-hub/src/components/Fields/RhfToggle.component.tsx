import { OdsToggle } from '@ovhcloud/ods-components/react';
import React, { ComponentProps } from 'react';
import { useRhfFieldContext } from './RhfField.context';

export function RhfToggle(
  props: Readonly<Omit<ComponentProps<typeof OdsToggle>, 'id' | 'name'>>,
) {
  const {
    id,
    controller: { field },
  } = useRhfFieldContext();

  return (
    <OdsToggle
      id={id}
      {...props}
      {...field}
      onOdsBlur={field.onBlur}
      onOdsChange={field.onChange}
    />
  );
}
