import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import NotFoundPage from './404';

describe('404 page', () => {
  it('should display page correctly', async () => {
    const { findByText } = render(<NotFoundPage />);
    const title = await findByText('404 - route not found');
    expect(title).toBeVisible();
  });
});
