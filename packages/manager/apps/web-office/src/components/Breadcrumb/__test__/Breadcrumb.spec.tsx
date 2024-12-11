import React from 'react';
import { describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb component', () => {
  it('should render', async () => {
    const { getByTestId } = render(<Breadcrumb />);
    const cmp = getByTestId('breadcrumb');
    expect(cmp).toBeInTheDocument();
  });
});
