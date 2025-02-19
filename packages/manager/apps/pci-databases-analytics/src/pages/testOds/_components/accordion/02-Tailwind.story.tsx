import { OdsAccordion } from '@ovhcloud/ods-components/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StoryResult } from '../Stories';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Accordion className="bg-orange-800" type="single" collapsible>
      <AccordionItem value="acc1">
        <AccordionTrigger className="text-blue-200">
          This is an accordion
        </AccordionTrigger>
        <AccordionContent className="bg-orange-400">
          This is the content of the accordion item
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsAccordion className="bg-orange-800">
      <span slot="summary" className="text-blue-200">
        This is an accordion
      </span>
      <div className="bg-orange-400">
        This is the content of the accordion item
      </div>
    </OdsAccordion>
  ),
  ODSComponentResult: StoryResult.fail,
};
