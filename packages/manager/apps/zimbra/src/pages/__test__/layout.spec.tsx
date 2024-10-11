import React from 'react';
import { describe, expect } from 'vitest';
import Layout from '../layout';
import { render, waitFor } from '@/utils/test.provider';

describe('Layout', () => {
  it('should render correctly', async () => {
    const { queryByTestId, container } = render(<Layout />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(container).toBeVisible();
  });
});
