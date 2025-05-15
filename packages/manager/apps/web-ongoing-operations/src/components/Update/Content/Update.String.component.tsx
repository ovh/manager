import React, { useState } from 'react';
import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';

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
  const [inputValue, setInputValue] = useState(value);
  return (
    <OdsFormField data-testid="field-name">
      <label slot="label">
        {t(`domain_operations_update_key_${argumentKey}`)}
      </label>

      <OdsInput
        type={ODS_INPUT_TYPE.text}
        id={argumentKey}
        value={inputValue}
        name={argumentKey}
        onOdsChange={({ detail }) => {
          setInputValue(detail.value as string);
          onChange(argumentKey, detail.value as string);
        }}
        data-testid={`input-${argumentKey}`}
      ></OdsInput>
    </OdsFormField>
  );
}
