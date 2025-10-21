import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Popover, PopoverContent, PopoverTrigger } from '..';

describe('Popover Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Show popover</PopoverTrigger>
        <PopoverContent>This is the popover content</PopoverContent>
      </Popover>,
    );
    expect(container).toMatchSnapshot();
  });
});
