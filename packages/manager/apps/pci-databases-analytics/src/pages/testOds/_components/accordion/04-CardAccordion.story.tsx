import { OdsAccordion } from '@ovhcloud/ods-components/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StoryResult } from '../Stories';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default {
  story: 'Card accordion',
  customComponentExemple: (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advancedConfiguration">
          <CardHeader>
            <AccordionTrigger data-testid="advanced-config-accordion-trigger">
              <h5>Advanced configuration</h5>
            </AccordionTrigger>
          </CardHeader>
          <CardContent className="p-0">
            <AccordionContent className="p-6">Content here</AccordionContent>
          </CardContent>
        </AccordionItem>
      </Accordion>
    </Card>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
