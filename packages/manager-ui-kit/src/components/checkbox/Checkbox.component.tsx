import { Checkbox as OdsCheckbox } from '@ovhcloud/ods-react';

import { CheckboxProps } from '@/components/checkbox/Checkbox.props';

export const Checkbox = ({ children, ...others }: CheckboxProps) => (
  <OdsCheckbox {...others}>{children}</OdsCheckbox>
);
