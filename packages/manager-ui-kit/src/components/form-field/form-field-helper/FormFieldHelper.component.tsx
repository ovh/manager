import { PropsWithChildren } from 'react';

import { FormFieldHelper as ODSFormFieldHelper } from '@ovhcloud/ods-react';

import { FormFieldHelperProps } from './FormFieldHelper.props';

export const FormFieldHelper = ({
  children,
  ...props
}: PropsWithChildren<FormFieldHelperProps>) => (
  <ODSFormFieldHelper {...props}>{children}</ODSFormFieldHelper>
);
