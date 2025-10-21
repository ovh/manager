import { OdsInputType } from '@ovhcloud/ods-components';

export type TextFieldType = OdsInputType | 'textarea';

export type TextFieldProps = {
  id: string;
  name?: string;
  label: string;
  type?: TextFieldType;
  value?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};
