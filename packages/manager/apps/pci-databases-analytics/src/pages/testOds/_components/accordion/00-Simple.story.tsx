import { OdsAccordion } from '@ovhcloud/ods-components/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple accordion',
  customComponentExemple: (
    <Accordion type="single" collapsible>
      <AccordionItem value="acc1">
        <AccordionTrigger>This is an accordion</AccordionTrigger>
        <AccordionContent>
          This is the content of the accordion item.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsAccordion>
      <span slot="summary">This is an accordion</span>
      <div>This is the content of the accordion item</div>
    </OdsAccordion>
  ),
  ODSComponentResult: StoryResult.success,
};
