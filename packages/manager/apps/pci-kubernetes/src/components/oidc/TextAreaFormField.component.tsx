import React, { FormEvent } from 'react';

import { OsdsTextarea } from '@ovhcloud/ods-components/react';

export type TTextAreaFormFieldProps = React.ComponentProps<typeof OsdsTextarea> & {
  name: string;
  onChange: (event: FormEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  onOdsValueChange: () => void;
  error: boolean;
  value: string;
  placeholder: string;
};

export const TextAreaFormField = ({
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  ...rest
}: TTextAreaFormFieldProps) => (
  <OsdsTextarea
    className={`mt-3 ${error ? 'bg-red-100 font-bold' : ''}`}
    name={name}
    data-testid={`${name}-textarea`}
    onOdsBlur={onBlur}
    value={value}
    onOdsValueChange={onChange}
    placeholder={placeholder}
    {...rest}
  />
);
