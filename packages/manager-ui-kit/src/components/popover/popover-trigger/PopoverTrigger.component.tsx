import { PropsWithChildren } from 'react';

import { PopoverTrigger as ODSPopoverTrigger } from '@ovhcloud/ods-react';

import { PopoverTriggerProps } from './PopoverTrigger.props';

export const PopoverTrigger = ({ children, ...props }: PropsWithChildren<PopoverTriggerProps>) => (
  <ODSPopoverTrigger {...props}>{children}</ODSPopoverTrigger>
);
