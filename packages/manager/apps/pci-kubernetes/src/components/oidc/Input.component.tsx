import { OsdsInput } from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';

export type InputProps = Omit<
  React.ComponentProps<typeof OsdsInput>,
  'onOdsValueChange' | 'onOdsInputBlur'
> & { onChange: () => void; onBlur: () => void };

export const Input = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  ...rest
}: InputProps) => (
  <OsdsInput
    type={ODS_INPUT_TYPE.text}
    className={`mt-3 ${error ? 'bg-red-100' : ''}`}
    name={name}
    data-testid={`${name}-input`}
    onOdsValueChange={onChange}
    onOdsInputBlur={onBlur}
    value={value}
    {...rest}
  />
);
