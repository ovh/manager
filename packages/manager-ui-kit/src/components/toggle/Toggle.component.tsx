import { Toggle as OdsToggle } from '@ovhcloud/ods-react';

import { ToggleProps } from '@/components';

export const Toggle = ({ children, ...others }: ToggleProps) => (
  <OdsToggle {...others}>{children}</OdsToggle>
);
