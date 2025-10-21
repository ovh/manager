import { FormField as OdsFormField } from '@ovhcloud/ods-react';

import { FormFieldProps } from '@/components';

export const FormField = ({ children, ...others }: FormFieldProps) => (
  <OdsFormField {...others}>{children}</OdsFormField>
);
