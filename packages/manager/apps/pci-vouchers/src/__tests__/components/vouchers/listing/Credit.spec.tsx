import { describe, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Credit from '@/components/vouchers/listing/Credit';

describe('Datagrid Listing Credit', () => {
  it('should display credit text', async () => {
    render(<Credit credit={{ text: '10 €' }} />);

    const productContent = screen.getByText('10 €');

    await waitFor(() => {
      expect(productContent).toBeInTheDocument();
    });
  });
});
