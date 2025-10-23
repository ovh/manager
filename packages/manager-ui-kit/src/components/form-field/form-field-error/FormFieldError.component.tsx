import { PropsWithChildren } from 'react';

import { FormFieldError as ODSFormFieldError } from '@ovhcloud/ods-react';

import { FormFieldErrorProps } from './FormFieldError.props';

export const FormFieldError = ({ children, ...props }: PropsWithChildren<FormFieldErrorProps>) => (
  <ODSFormFieldError {...props}>{children}</ODSFormFieldError>
);
