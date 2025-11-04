import { PropsWithChildren } from 'react';

import { AccordionContent as ODSAccordionContent } from '@ovhcloud/ods-react';

import { AccordionContentProps } from './AccordionContent.props';

export const AccordionContent = ({
  children,
  ...props
}: PropsWithChildren<AccordionContentProps>) => (
  <ODSAccordionContent {...props}>{children}</ODSAccordionContent>
);
