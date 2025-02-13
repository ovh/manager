import React, { useState } from 'react';
import { OdsInput } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

interface StringComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
}

export default function StringComponent({
  argumentKey,
  value,
  onChange,
}: StringComponentProps) {
  const { t } = useTranslation('dashboard');
  const [inputValue, setInputValue] = useState(value);
  return (
    <div className="mb-3">
      <div className="ods-form-field__label">
        <label htmlFor={argumentKey}>
          {t(`domain_operations_update_key_${argumentKey}`)}
        </label>
      </div>
      <OdsInput
        id={argumentKey}
        value={inputValue}
        name={argumentKey}
        onOdsChange={({ detail }) => {
          setInputValue(detail.value as string);
          onChange(argumentKey, detail.value as string);
        }}
        data-testid={`input-${argumentKey}`}
      ></OdsInput>
    </div>
  );
}
