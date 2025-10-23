import { PropsWithChildren } from 'react';

import { CheckboxGroup as ODSCheckboxGroup } from '@ovhcloud/ods-react';

import { CheckboxGroupProps } from './CheckboxGroup.props';

export const CheckboxGroup = ({ children, ...props }: PropsWithChildren<CheckboxGroupProps>) => (
  <ODSCheckboxGroup {...props}>{children}</ODSCheckboxGroup>
);
