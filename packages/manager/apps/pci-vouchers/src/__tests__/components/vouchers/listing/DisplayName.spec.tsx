import { describe, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import DisplayName from '@/components/vouchers/listing/DisplayName';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

vi.mock('@/data/bill', () => {
  return {
    getBill: () => ({
      pdfUrl: 'http://ovh.com',
    }),
  };
});

vi.mock('@ovhcloud/manager-components', async () => ({
  DataGridTextCell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Datagrid Listing Product', () => {
  it('should display product description', async () => {
    render(
      <DisplayName
        voucher={{ description: 'Voucher description', bill: null }}
      />,
    );

    const productContent = screen.getByText('Voucher description');

    await waitFor(() => {
      expect(productContent).toBeInTheDocument();
    });
  });

  it('should display bill url', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <DisplayName
          voucher={{ description: 'Voucher description', bill: '1234' }}
        />
      </QueryClientProvider>,
    );

    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();

    await waitFor(() => {
      const provisionningContent = screen.getByText(
        'cpb_vouchers_name_credit_provisionning',
      );

      const billContent = screen.getByText('cpb_vouchers_bill_ref');

      expect(provisionningContent).toBeInTheDocument();
      expect(billContent).toBeInTheDocument();
    });
  });
});
