import { OdsAccordion } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StoryResult } from '../Stories';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default {
  story: 'Form in an accordion',
  customComponentExemple: () => {
    const [email, setEmail] = useState('');
    return (
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" disabled value={email} />
        <Accordion type="single" collapsible>
          <AccordionItem value="ap">
            <AccordionTrigger className="text-base">
              Advanced params
            </AccordionTrigger>
            <AccordionContent>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [odsEmail, setOdsEmail] = useState('');

    return (
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" disabled value={odsEmail} />
        <OdsAccordion>
          <span slot="summary">Advanced params</span>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={odsEmail}
              onChange={(e) => setOdsEmail(e.target.value)}
            />
          </div>
        </OdsAccordion>
      </div>
    );
  },
  ODSComponentResult: StoryResult.fail,
};
