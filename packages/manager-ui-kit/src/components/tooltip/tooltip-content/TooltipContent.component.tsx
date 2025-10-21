import { PropsWithChildren } from 'react';

import { TooltipContent as ODSTooltipContent } from '@ovhcloud/ods-react';

import { TooltipContentProps } from './TooltipContent.props';

export const TooltipContent = ({ children, ...props }: PropsWithChildren<TooltipContentProps>) => (
  <ODSTooltipContent {...props}>{children}</ODSTooltipContent>
);
