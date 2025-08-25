import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import ConfigureLayout from './Configure.layout';

describe('Configure Layout', () => {
  it('should render correctly', () => {
    const { container } = render(<ConfigureLayout />);
    expect(container).toBeVisible();
  });
});
