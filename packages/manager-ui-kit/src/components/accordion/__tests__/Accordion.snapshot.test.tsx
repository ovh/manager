import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '..';

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
