import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StoryResult } from '../Stories';

export default {
  story: 'Multiple accordion',
  customComponentExemple: (
    <Accordion type="single" collapsible>
      <AccordionItem value="acc1">
        <AccordionTrigger>This is an accordion</AccordionTrigger>
        <AccordionContent>
          This is the content of the accordion item
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="acc2">
        <AccordionTrigger>This is also an accordion</AccordionTrigger>
        <AccordionContent>
          This is the content of the second accordion item
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
