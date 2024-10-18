import { describe, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import DisplayName from '@/components/vouchers/listing/DisplayName';

vi.mock('@/api/data/bill', () => ({
  getBill: () => ({
    pdfUrl: 'http://ovh.com',
  }),
}));

vi.mock('@ovh-ux/manager-react-components', async () => ({
  DataGridTextCell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Datagrid Listing Product', () => {
  it('should display product description', async () => {
    const { getByText } = render(
      <DisplayName
        voucher={{ description: 'Voucher description', bill: null }}
      />,
    );

    const productContent = getByText('Voucher description');

    await waitFor(() => {
      expect(productContent).toBeInTheDocument();
    });
  });

  it('should display bill url', async () => {
    const queryClient = new QueryClient();
    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <DisplayName
          voucher={{ description: 'Voucher description', bill: '1234' }}
        />
      </QueryClientProvider>,
    );

    const spinnerElement = getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();

    await waitFor(() => {
      const provisionningContent = getByText(
        'cpb_vouchers_name_credit_provisionning',
      );

      const billContent = getByText('cpb_vouchers_bill_ref');

      expect(provisionningContent).toBeInTheDocument();
      expect(billContent).toBeInTheDocument();
    });
  });
});
