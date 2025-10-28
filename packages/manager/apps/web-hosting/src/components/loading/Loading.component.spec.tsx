import React from 'react';

import { describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test.provider';

import Loading from './Loading.component';

describe('Loading component', () => {
  it('should render loading component', () => {
    render(<Loading />);
    const container = screen.getByTestId('spinner');
    expect(container).toBeInTheDocument();
  });
});
