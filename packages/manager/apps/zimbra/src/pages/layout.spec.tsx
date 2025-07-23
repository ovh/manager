import React from 'react';

import { describe, expect } from 'vitest';

import { render, waitFor } from '@/utils/test.provider';

import Layout from './layout';

describe('Layout', () => {
  it('should render correctly', async () => {
    const { queryByTestId, container } = render(<Layout />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(container).toBeVisible();
  });
});
