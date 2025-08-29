import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import Dashboard from './Dashboard.layout';

describe('Dashboard layout', () => {
  it('should display correctly', () => {
    const { getByTestId } = render(<Dashboard />);
    const cmp = getByTestId('breadcrumb');
    expect(cmp).toBeInTheDocument();
  });
});
