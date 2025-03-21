import React from 'react';
import { describe, expect } from 'vitest';
import ConfigureLayout from '../Configure.layout';
import { render } from '@/utils/test.provider';

describe('Configure Layout', () => {
  it('should render correctly', () => {
    const { container } = render(<ConfigureLayout />);
    expect(container).toBeVisible();
  });
});
