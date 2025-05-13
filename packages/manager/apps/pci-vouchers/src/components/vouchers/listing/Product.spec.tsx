import { describe, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import Product from '@/components/vouchers/listing/Product';

vi.mock('@ovh-ux/manager-react-components', async () => ({
  DataGridTextCell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Datagrid Listing Product', () => {
  it('should display list of products', async () => {
    render(<Product product={['A', 'B']} />);

    const productContent = screen.getByText('A, B');

    await waitFor(() => {
      expect(productContent).toBeInTheDocument();
    });
  });

  it('should display default text if no product defined', async () => {
    render(<Product product={null} />);

    const productContent = screen.getByText('cpb_vouchers_products_all');

    await waitFor(() => {
      expect(productContent).toBeInTheDocument();
    });
  });
});
