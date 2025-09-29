import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxProp,
  FormField,
  FormFieldLabel,
} from '@ovhcloud/ods-react';
import { ErrorText } from './ErrorText';

export const ComboboxField = ({
  label,
  errorMessage,
  invalid,
  ...comboboxProps
}: {
  label: string;
  errorMessage?: string;
  invalid: boolean;
} & ComboboxProp) => (
  <FormField invalid={invalid}>
    <FormFieldLabel>{label}</FormFieldLabel>
    <Combobox {...comboboxProps}>
      <ComboboxControl />
      <ComboboxContent className="max-h-52 overflow-y-scroll" />
    </Combobox>
    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
  </FormField>
);
