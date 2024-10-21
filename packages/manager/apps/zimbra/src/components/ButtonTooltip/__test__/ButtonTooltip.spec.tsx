import React from 'react';
import { describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import ButtonTooltip from '../ButtonTooltip';

describe('ButtonTooltip component', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <ButtonTooltip tooltipContent={[{ label: 'Test' }]} />,
    );
    const cmp = getByTestId('button-tooltip');
    expect(cmp).toBeInTheDocument();
  });
});
