import React, { useState } from 'react';
import { OdsInput } from '@ovhcloud/ods-components/react';

interface StringComponentProps {
  argumentKey: string;
  value: string;
  onChange: (key: string, value: string) => void;
}

export default function StringComponent({
  argumentKey,
  value,
  onChange,
}: StringComponentProps) {
  const [v, setValue] = useState(value);
  return (
    <div className="mb-3">
      <div className="ods-form-field__label">
        <label htmlFor={argumentKey}>{argumentKey}</label>
      </div>
      <OdsInput
        id={argumentKey}
        placeholder={value}
        value={v}
        name={argumentKey}
        onOdsChange={({ detail }) => {
          setValue(detail.value as string);
          onChange(argumentKey, detail.value as string);
        }}
      ></OdsInput>
    </div>
  );
}
