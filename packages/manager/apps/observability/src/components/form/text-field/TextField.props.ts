import type { INPUT_TYPE } from '@ovhcloud/ods-react';

type InputType = `${INPUT_TYPE}`;

export type TextFieldProps = {
  id: string;
  name?: string;
  label: string;
  type?: InputType | 'textarea';
  value?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  helper: string;
};
