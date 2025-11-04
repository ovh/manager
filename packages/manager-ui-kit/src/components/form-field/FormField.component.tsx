import { FormField as OdsFormField } from '@ovhcloud/ods-react';

import { FormFieldProps } from '@/components/form-field/FormField.props';

export const FormField = ({ children, ...others }: FormFieldProps) => (
  <OdsFormField {...others}>{children}</OdsFormField>
);
