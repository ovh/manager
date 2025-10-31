import { Popover as OdsPopover } from '@ovhcloud/ods-react';

import { PopoverProps } from '@/components/popover/Popover.props';

export const Popover = ({ children, ...others }: PopoverProps) => (
  <OdsPopover {...others}>{children}</OdsPopover>
);
