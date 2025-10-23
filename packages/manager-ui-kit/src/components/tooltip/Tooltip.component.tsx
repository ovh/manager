import { Tooltip as OdsTooltip } from '@ovhcloud/ods-react';

import { TooltipProps } from '@/components';

export const Tooltip = ({ children, ...others }: TooltipProps) => (
  <OdsTooltip {...others}>{children}</OdsTooltip>
);
