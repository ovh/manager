import React from 'react';
import { describe, expect } from 'vitest';
import AutoReplies from '../AutoReplies';
import { render } from '@/utils/test.provider';

describe('Redirections page', () => {
  it('should display page correctly', () => {
    const { getByTestId } = render(<AutoReplies />);
    const wrapper = getByTestId('autoreplies');

    expect(wrapper).toBeVisible();
  });
});
