import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import NotFound from '@/pages/404.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

describe('404 NotFound page', () => {
  it('should display Not Found pages', async () => {
    render(<NotFound />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('404 - route not found')).toBeInTheDocument();
    });
  });
});
