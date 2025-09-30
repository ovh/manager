import { PropsWithChildren } from 'react';
import { FormFieldError } from '@ovhcloud/ods-react';

export const ErrorText = ({ children }: PropsWithChildren) => {
  return <FormFieldError>{children}</FormFieldError>;
};
