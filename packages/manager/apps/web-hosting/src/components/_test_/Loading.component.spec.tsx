import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test.provider';
import Loading from '../loading/Loading.component';

describe('Loading component', () => {
  it('should render loading component', () => {
    render(<Loading />);
    const container = screen.getByTestId('spinner');
    expect(container).toBeInTheDocument();
  });
});
