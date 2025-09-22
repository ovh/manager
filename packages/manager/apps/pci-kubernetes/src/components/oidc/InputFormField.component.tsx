import React, { FormEvent } from 'react';

import { ODS_INPUT_TYPE, ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { OsdsInput, OsdsText } from '@ovhcloud/ods-components/react';

export type TInputFormFieldProps = React.ComponentProps<typeof OsdsInput> & {
  name: string;
  onChange: (event: FormEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onOdsValueChange: () => void;
  error: boolean;
  value: string;
  placeholder: string;
  caption?: string;
};

export const InputFormField = ({
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  caption,
  ...rest
}: TInputFormFieldProps) => (
  <>
    <OsdsInput
      type={ODS_INPUT_TYPE.text}
      className={`mt-3 ${error ? 'bg-red-100' : ''}`}
      name={name}
      data-testid={`${name}-input`}
      onOdsInputBlur={onBlur}
      value={value}
      placeholder={placeholder}
      onOdsValueChange={onChange}
      {...rest}
    />
    {caption && (
      <OsdsText className="mt-3" color={ODS_TEXT_COLOR_INTENT.text} level={ODS_TEXT_LEVEL.caption}>
        {caption}
      </OsdsText>
    )}
  </>
);
