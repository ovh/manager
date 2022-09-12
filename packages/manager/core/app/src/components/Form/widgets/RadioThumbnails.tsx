import React from 'react';
import { ThumbnailRadio } from '@ovh-ux/manager-themes';
import { EnumOptionsType, WidgetProps } from '@rjsf/utils';
import { FormControl, RadioGroup } from '@chakra-ui/react';

export const RadioThumbnails = ({
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  onChange,
}: WidgetProps) => {
  const { enumOptions, enumDisabled } = options;

  return (
    <FormControl
      mb={1}
      isDisabled={disabled || readonly}
      isRequired={required}
      isReadOnly={readonly}
    >
      <RadioGroup
        defaultValue={`${value}`}
        onChange={(option) => onChange(option)}
      >
        {enumOptions.map((option: EnumOptionsType, index: number) => {
          const itemDisabled = enumDisabled?.indexOf(option.value) > -1;

          return (
            <ThumbnailRadio
              value={`${option.value}`}
              key={index}
              id={`${id}-radio-${option.value}`}
              isDisabled={disabled || itemDisabled || readonly}
              radioTitle={option.label}
            ></ThumbnailRadio>
          );
        })}
      </RadioGroup>
    </FormControl>
  );

  // <div>Radio Thumbnails</div>;
};

export default RadioThumbnails;
