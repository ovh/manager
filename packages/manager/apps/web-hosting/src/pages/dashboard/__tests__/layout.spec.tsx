import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { renderWithRouter } from '@/utils/test.provider';

import Layout from '../layout';

describe('Layout', () => {
  it('should render correctly', async () => {
    const { queryByTestId, container } = renderWithRouter(<Layout />, { route: '/test-service' });

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(container).toBeVisible();
  });
});
