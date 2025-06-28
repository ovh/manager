import '@/alldoms/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/alldoms/utils/test.provider';
import { serviceInfoDetail } from '@/alldoms/__mocks__/serviceInfoDetail';
import ServiceTerminate from '@/alldoms/pages/service/serviceTerminate/serviceTerminate';
import { useGetServiceInfo } from '@/alldoms/hooks/data/useGetServiceInfo';

vi.mock('@/alldoms/hooks/data/useGetServiceInfo', () => ({
  useGetServiceInfo: vi.fn(),
}));

describe('Terminate service', () => {
  it('display the modal', async () => {
    (useGetServiceInfo as jest.Mock).mockReturnValue({
      data: serviceInfoDetail,
      isLoading: false,
    });

    render(<ServiceTerminate />, { wrapper });
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('allDom_modal_subtitle')).toBeInTheDocument();
      expect(screen.getByText('allDom_modal_choice')).toBeInTheDocument();
      expect(
        screen.getByText('allDom_modal_step_one_message'),
      ).toBeInTheDocument();
    });
  });

  (useGetServiceInfo as jest.Mock).mockReturnValue({
    data: serviceInfoDetail,
    isLoading: false,
  });

  serviceInfoDetail.domainAttached.forEach((domain) => {
    it(`should render ${domain} checkbox`, async () => {
      render(<ServiceTerminate />, { wrapper });
      await waitFor(async () => {
        const checkbox = await screen.findByTestId(`checkbox-${domain}`);
        const input = checkbox.querySelector('input');
        expect(input).toBeInTheDocument();
        expect(input?.checked).toBe(false);
        fireEvent.click(input!);
        expect(input?.checked).toBe(true);
      });
    });
  });

  it('should select all checkboxes when the "select all" checkbox is clicked', async () => {
    (useGetServiceInfo as jest.Mock).mockReturnValue({
      data: serviceInfoDetail,
      isLoading: false,
    });

    render(<ServiceTerminate />, { wrapper });

    const selectAllCheckbox = await screen.findByTestId('checkbox-alldomains');

    expect(selectAllCheckbox).toBeInTheDocument();

    fireEvent.click(selectAllCheckbox);

    await waitFor(async () => {
      await Promise.all(
        serviceInfoDetail.domainAttached.map(async (domain) => {
          const checkbox = await screen.findByTestId(`checkbox-${domain}`);
          const input = checkbox.querySelector('input');
          expect(input?.checked).toBe(true);
        }),
      );
    });
  });
});
