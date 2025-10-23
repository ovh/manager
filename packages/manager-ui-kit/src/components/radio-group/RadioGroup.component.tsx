import { RadioGroup as OdsRadioGroup } from '@ovhcloud/ods-react';

import { RadioGroupProps } from '@/components';

export const RadioGroup = ({ children, ...others }: RadioGroupProps) => (
  <OdsRadioGroup {...others}>{children}</OdsRadioGroup>
);
