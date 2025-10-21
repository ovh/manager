import { PropsWithChildren } from 'react';

import { TooltipTrigger as ODSTooltipTrigger } from '@ovhcloud/ods-react';

import { TooltipTriggerProps } from './TooltipTrigger.props';

export const TooltipTrigger = ({ children, ...props }: PropsWithChildren<TooltipTriggerProps>) => (
  <ODSTooltipTrigger {...props}>{children}</ODSTooltipTrigger>
);
