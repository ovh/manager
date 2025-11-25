import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  INPUT_TYPE,
} from '@ovhcloud/ods-react';
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
      if (newValue.trim()) {
        const result = schema?.safeParse(newValue);
        if (result?.success) {
         setError(null);
          onChange(argumentKey, newValue);
        } else {
           setError(
            t('domain_operations_update_field_bad_value', {
              t0: argumentKey,
            }),
          );
        }
      } else {
        setError(null);
      }
      inputRef.current = newValue;
      setInputValue(newValue);
    }
  };

  return (
    <div>
      <FormField className="w-1/4" invalid={error != null && error.length > 0}>
        <FormFieldLabel>
          {t(`domain_operations_update_key_${argumentKey}`)}
        </FormFieldLabel>
        <Input
          id={argumentKey}
          name={argumentKey}
          type={INPUT_TYPE.text}
          value={inputValue}
          data-testid={`input-${argumentKey}`}
          onChange={(detail) => handleChange(detail.target.value)}
        />
        <FormFieldError className="text-sm">{error}</FormFieldError>
      </FormField>
    </div>
  );
}
