import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Quantity,
  QuantityControl,
  QuantityInput,
  Text,
} from '@ovhcloud/ods-react';

export interface QuantitySelectorProps {
  label?: string;
  labelHelpText?: string;
  description?: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  contentClassName?: string;
  id?: string;
}

export function QuantitySelector({
  label,
  labelHelpText,
  description,
  value,
  onValueChange,
  min,
  max,
  className,
  contentClassName,
  id = 'quantity-selector',
  ...props
}: Readonly<QuantitySelectorProps>) {
  const { t } = useTranslation('quantity-selector');

  const error = {
    min: min !== undefined && value < min,
    max: max !== undefined && value > max,
    nan: Number.isNaN(value),
  };

  return (
    <FormField
      data-testid="form-field"
      invalid={Object.values(error).some((e) => e)}
      className={className}
      {...props}
    >
      {label && (
        <FormFieldLabel>
          {label}

          {labelHelpText && (
            <Popover>
              <PopoverTrigger asChild>
                <Icon name="circle-question" className="cursor-help text-[16px]" />
              </PopoverTrigger>
              <PopoverContent className="max-w-xs">
                <Text>{labelHelpText}</Text>
              </PopoverContent>
            </Popover>
          )}
        </FormFieldLabel>
      )}

      <Quantity
        value={value.toString()}
        onValueChange={({ valueAsNumber }) => {
          onValueChange(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
        }}
        min={min}
        max={max}
      >
        <QuantityControl>
          <QuantityInput />
        </QuantityControl>
      </Quantity>

      {description && (
        <FormFieldHelper>
          <Text preset="caption">{description}</Text>
        </FormFieldHelper>
      )}
      {error.min && (
        <FormFieldError>
          <Text preset="caption" className="text-red-500">
            {t('common_field_error_min', { min })}
          </Text>
        </FormFieldError>
      )}
      {error.max && (
        <FormFieldError>
          <Text preset="caption" className="text-red-500">
            {t('common_field_error_max', { max })}
          </Text>
        </FormFieldError>
      )}
      {error.nan && (
        <FormFieldError>
          <Text preset="caption" className="text-red-500">
            {t('common_field_error_number')}
          </Text>
        </FormFieldError>
      )}
    </FormField>
  );
}
