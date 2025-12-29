import { FieldError } from 'react-hook-form';

export type BoundsFormFieldHelperProps = {
  min: string | undefined;
  max: string | undefined;
  error: FieldError | undefined;
  hasRetentionError: boolean;
};
