import { RadioGroup as OdsRadioGroup } from '@ovhcloud/ods-react';

import { RadioGroupProps } from '@/components/radio-group/RadioGroup.props';

export const RadioGroup = ({ children, ...others }: RadioGroupProps) => (
  <OdsRadioGroup {...others}>{children}</OdsRadioGroup>
);
