import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

import { getUiOptions } from '../utils';

export const SwitchWidget = ({
  id,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  required,
  label,
  uiSchema,
}: WidgetProps) => {
  const onChangeEvent = ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => onChange(checked);
  const onBlurEvent = ({
    target,
  }: React.FocusEvent<HTMLInputElement | unknown>) =>
    onBlur(id, (target as HTMLInputElement).value);
  const onFocusEvent = ({
    target,
  }: React.FocusEvent<HTMLInputElement | unknown>) =>
    onFocus(id, (target as HTMLInputElement).value);

  const { size } = getUiOptions(uiSchema);

  return (
    <FormControl
      mb={1}
      isDisabled={disabled || readonly}
      isRequired={required}
      isReadOnly={readonly}
    >
      {label && (
        <FormLabel htmlFor={id} id={`${id}-label`}>
          {label}
        </FormLabel>
      )}
      <Switch
        id={id}
        size={size}
        isDisabled={disabled}
        isRequired={required}
        onChange={onChangeEvent}
        onBlur={onBlurEvent}
        onFocus={onFocusEvent}
      />
    </FormControl>
  );
};

export default SwitchWidget;
