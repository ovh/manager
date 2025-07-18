import React, { useRef, useState } from 'react';
import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { editableArgument } from '@/constants';

interface UpdateStringComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
}

export default function UpdateStringComponent({
  argumentKey,
  value,
  onChange,
}: UpdateStringComponentProps) {
  const { t } = useTranslation('dashboard');
  const inputRef = useRef(value);
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const schema = editableArgument[argumentKey] ?? editableArgument.default;
  const handleChange = (newValue: string) => {
    if (inputRef.current !== newValue) {
      if (!newValue.trim()) {
        setError(null);
      } else {
        const result = schema.safeParse(newValue);
        if (!result.success) {
          setError(
            t('domain_operations_update_field_bad_value', {
              t0: argumentKey,
            }),
          );
        } else {
          setError(null);
          onChange(argumentKey, newValue);
        }
      }
      inputRef.current = newValue;
      setInputValue(newValue);
    }
  };

  return (
    <OdsFormField data-testid="field-name" error={error}>
      <label slot="label">
        {t(`domain_operations_update_key_${argumentKey}`)}
      </label>

      <OdsInput
        type={ODS_INPUT_TYPE.text}
        id={argumentKey}
        value={inputValue}
        name={argumentKey}
        onOdsChange={({ detail }) => {
          handleChange(detail.value as string);
        }}
        data-testid={`input-${argumentKey}`}
        hasError={!!error}
      ></OdsInput>
    </OdsFormField>
  );
}
