import { Select as OdsSelect } from '@ovhcloud/ods-react';

import { SelectProps } from '@/components/select/Select.props';

export const Select = ({ children, ...others }: SelectProps) => (
  <OdsSelect {...others}>{children}</OdsSelect>
);
