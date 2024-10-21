import React from 'react';
import { describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import Dashboard from '../Dashboard';

describe('Dashboard component', () => {
  it('should display correctly', async () => {
    const { getByTestId } = render(<Dashboard />);
    const cmp = getByTestId('breadcrumb');
    expect(cmp).toBeInTheDocument();
  });
});
