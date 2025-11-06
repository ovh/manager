import { Toggle as OdsToggle } from '@ovhcloud/ods-react';

import { ToggleProps } from '@/components/toggle/Toggle.props';

export const Toggle = ({ children, ...others }: ToggleProps) => (
  <OdsToggle {...others}>{children}</OdsToggle>
);
