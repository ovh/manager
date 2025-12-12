import type { INPUT_TYPE } from '@ovh-ux/muk';

type InputType = `${INPUT_TYPE}`;

export type TextFieldProps = {
  id: string;
  name?: string;
  label: string;
  type?: InputType | 'textarea'; // TODO no export of InputType from @ovh-ux/muk
  value?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};
