import { OdsQuantity } from '@ovhcloud/ods-components/react';
import React, { ComponentProps } from 'react';
import { useRhfFieldContext } from './RhfField.context';

export function RhfQuantity(
  props: Readonly<Omit<ComponentProps<typeof OdsQuantity>, 'id' | 'name'>>,
) {
  const {
    id,
    controller: {
      field,
      fieldState: { error },
    },
  } = useRhfFieldContext();

  return (
    <OdsQuantity
      id={id}
      className="mr-auto"
      {...props}
      {...field}
      hasError={!!error}
      onOdsBlur={field.onBlur}
      onOdsChange={field.onChange}
    />
  );
}
