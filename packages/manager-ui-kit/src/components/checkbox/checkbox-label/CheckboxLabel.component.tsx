import { PropsWithChildren } from 'react';

import { CheckboxLabel as ODSCheckboxLabel } from '@ovhcloud/ods-react';

import { CheckboxLabelProps } from './CheckboxLabel.props';

export const CheckboxLabel = ({ children, ...props }: PropsWithChildren<CheckboxLabelProps>) => (
  <ODSCheckboxLabel {...props}>{children}</ODSCheckboxLabel>
);
