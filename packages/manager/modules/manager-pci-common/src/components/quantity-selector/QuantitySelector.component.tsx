import { ODS_ICON_NAME, OdsInputChangeEvent } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsIcon,
  OdsPopover,
  OdsQuantity,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

import '../../translations/quantity-selector';

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
  id = 'popover-trigger',
  ...props
}: Readonly<QuantitySelectorProps>) {
  const { t } = useTranslation('pci-quantity-selector');
  const error = {
    min: min !== undefined && value < min,
    max: max !== undefined && value > max,
    nan: Number.isNaN(value),
  };

  return (
    <OdsFormField className={className} {...props}>
      <div className={contentClassName}>
        <div className="flex gap-2">
          {label && (
            <OdsText preset="span" className="text-[14px] font-bold">
              {label}
            </OdsText>
          )}
          {labelHelpText && (
            <>
              <div id={id}>
                <OdsIcon
                  name={ODS_ICON_NAME.question}
                  className="cursor-help text-[16px]"
                />
              </div>
              <OdsPopover triggerId={id} className="w-4 h-4">
                {labelHelpText}
              </OdsPopover>
            </>
          )}
        </div>

        {description && (
          <OdsText preset="span" className="mb-6">
            {description}
          </OdsText>
        )}
        <OdsQuantity
          onOdsChange={(event: OdsInputChangeEvent) =>
            onValueChange(Number(event.detail.value))
          }
          min={min}
          max={max}
          name="quantity"
          isDisabled={min !== undefined && value - 1 < min}
        />
      </div>
      {error.min && (
        <OdsText className="text-[--ods-color-critical-500]">
          {t('common_field_error_min', { min })}
        </OdsText>
      )}
      {error.max && (
        <OdsText className="text-[--ods-color-critical-500]">
          {t('common_field_error_max', { max })}
        </OdsText>
      )}
      {error.nan && (
        <OdsText className="text-[--ods-color-critical-500]">
          {t('common_field_error_number')}
        </OdsText>
      )}
    </OdsFormField>
  );
}
