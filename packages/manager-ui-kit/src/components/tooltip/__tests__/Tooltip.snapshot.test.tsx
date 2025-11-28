import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';

describe('Tooltip Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger>Show tooltip</TooltipTrigger>
        <TooltipContent>This is the tooltip content</TooltipContent>
      </Tooltip>,
    );
    expect(container).toMatchSnapshot();
  });
});
