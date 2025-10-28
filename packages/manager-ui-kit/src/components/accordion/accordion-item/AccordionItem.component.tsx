import { PropsWithChildren } from 'react';

import { AccordionItem as ODSAccordionItem } from '@ovhcloud/ods-react';

import { AccordionItemProps } from './AccordionItem.props';

export const AccordionItem = ({ children, ...props }: PropsWithChildren<AccordionItemProps>) => (
  <ODSAccordionItem {...props}>{children}</ODSAccordionItem>
);
