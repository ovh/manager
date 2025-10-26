import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsSelect, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { SelectFieldProps } from '@/components/form/select-field/SelectField.props';

export const SelectField = ({
  label,
  placeholder,
  value,
  name,
  className,
  options,
  children,
  isLoading = false,
  isDisabled = false,
  error,
  onOdsChange,
}: SelectFieldProps) => {
  return (
    <OdsFormField className="my-4 w-full">
      {isLoading ? (
        <OdsSkeleton className={className} />
      ) : (
        <>
          {label && (
            <OdsText preset={ODS_TEXT_PRESET.paragraph} slot="label">
              {label}
            </OdsText>
          )}
          <OdsSelect
            className={className}
            value={value}
            name={name}
            placeholder={placeholder}
            onOdsChange={onOdsChange}
            hasError={!!error && !isDisabled}
            isDisabled={isDisabled}
          >
            {children ||
              options?.map(({ value: optionValue, label: optionLabel }) => (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              ))}
          </OdsSelect>
          {error && (
            <OdsText preset={ODS_TEXT_PRESET.caption} slot="helper">
              {error}
            </OdsText>
          )}
        </>
      )}
    </OdsFormField>
  );
};
