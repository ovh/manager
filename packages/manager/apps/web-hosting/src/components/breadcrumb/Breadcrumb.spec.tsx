import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import Breadcrumb from './Breadcrumb.component';

describe('Breadcrumb component', () => {
  it('should render', () => {
    const { getByTestId } = render(<Breadcrumb />);
    const cmp = getByTestId('breadcrumb');
    expect(cmp).toBeInTheDocument();
  });
});
