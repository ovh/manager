import React from 'react';
import { describe, it, expect } from 'vitest';
import Websites from './Websites.page';
import { render } from '@/test.provider';

describe('Websites page', () => {
  it('displays loading rows while main request are loading', () => {
    const { queryAllByTestId } = render(<Websites />);
    expect(queryAllByTestId('loading-row')?.length).not.toBe(0);
  });
});
