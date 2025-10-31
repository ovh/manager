import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Accordion } from '@/components/accordion/Accordion.component';
import { AccordionContent } from '@/components/accordion/accordion-content/AccordionContent.component';
import { AccordionItem } from '@/components/accordion/accordion-item/AccordionItem.component';
import { AccordionTrigger } from '@/components/accordion/accordion-trigger/AccordionTrigger.component';

describe('Accordion Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="0">
          <AccordionTrigger>Hello World!</AccordionTrigger>
          <AccordionContent>Lorem ipsum dolor sit amet.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(container).toMatchSnapshot();
  });
});
