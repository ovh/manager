import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import Breadcrumb from './Breadcrumb.component';

describe('Breadcrumb component', () => {
  it('should render', () => {
    const { container } = render(<Breadcrumb />);
    const cmp = container.querySelector('[data-ods="breadcrumb"]');
    expect(cmp).toBeInTheDocument();
  });
});
