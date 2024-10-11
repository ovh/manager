import React from 'react';
import { describe, expect } from 'vitest';
import Layout from '../_layout';
import { render, waitFor } from '@/utils/test.provider';

describe('Layout dashboard', () => {
  it('should render correctly', async () => {
    const { getByTestId, queryByTestId } = render(<Layout />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('breadcrumb')).toBeVisible();
  });
});
