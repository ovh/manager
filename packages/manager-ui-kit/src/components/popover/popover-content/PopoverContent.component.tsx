import { PropsWithChildren } from 'react';

import { PopoverContent as ODSPopoverContent } from '@ovhcloud/ods-react';

import { PopoverContentProps } from './PopoverContent.props';

export const PopoverContent = ({ children, ...props }: PropsWithChildren<PopoverContentProps>) => (
  <ODSPopoverContent {...props}>{children}</ODSPopoverContent>
);
