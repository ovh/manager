import { PropsWithChildren } from 'react';

import { AccordionTrigger as ODSAccordionTrigger } from '@ovhcloud/ods-react';

import { AccordionTriggerProps } from './AccordionTrigger.props';

export const AccordionTrigger = ({
  children,
  ...props
}: PropsWithChildren<AccordionTriggerProps>) => (
  <ODSAccordionTrigger {...props}>{children}</ODSAccordionTrigger>
);
