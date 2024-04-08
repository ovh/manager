import { render, screen, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import PageLayout from '@/components/PageLayout/PageLayout';

describe('Breadcrumb component', () => {
  it('should display the page layout', async () => {
    render(<PageLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('pageLayout')).toBeInTheDocument();
    });
  });
});
