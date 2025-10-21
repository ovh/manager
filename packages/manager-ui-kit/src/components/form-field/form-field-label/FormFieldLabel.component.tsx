import { PropsWithChildren } from 'react';

import { FormFieldLabel as ODSFormFieldLabel } from '@ovhcloud/ods-react';

import { FormFieldLabelProps } from './FormFieldLabel.props';

export const FormFieldLabel = ({ children, ...props }: PropsWithChildren<FormFieldLabelProps>) => (
  <ODSFormFieldLabel {...props}>{children}</ODSFormFieldLabel>
);
