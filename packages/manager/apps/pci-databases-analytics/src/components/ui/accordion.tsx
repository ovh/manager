import * as React from "react";
import { OdsAccordion } from '@ovhcloud/ods-components/react';

const Accordion = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { isDisabled?: boolean; isOpen?: boolean, type?: string, collapsible?: boolean }
>(({ className, isDisabled = false, isOpen = false, children, ...props }, ref) => {
  return (
    <OdsAccordion
      ref={ref as React.Ref<HTMLOdsAccordionElement>}
      class={className}
      isDisabled={isDisabled}
      isOpen={isOpen}
      {...props}
    >
      {children}
    </OdsAccordion>
  );
});
Accordion.displayName = "Accordion";

const AccordionItem: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  ...props
}) => {
  return <>{children}</>;
};

const AccordionTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div slot="summary">{children}</div>;
};

const AccordionContent = ({ children }: { children: React.ReactElement }) => {
  return <span>{children}</span>;
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
