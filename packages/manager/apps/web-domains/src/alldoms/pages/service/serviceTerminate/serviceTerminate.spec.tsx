import '@/alldoms/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/alldoms/utils/test.provider';
import { serviceInfoDetail } from '@/alldoms/__mocks__/serviceInfoDetail';
import ServiceTerminate from '@/alldoms/pages/service/serviceTerminate/serviceTerminate';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';

vi.mock('@/alldoms/hooks/data/useGetAllDom', () => ({
  useGetAllDom: vi.fn(),
}));

describe('Terminate service', () => {
  it('display the modal', async () => {
    (useGetAllDom as jest.Mock).mockReturnValue({
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

  (useGetAllDom as jest.Mock).mockReturnValue({
    data: serviceInfoDetail,
    isLoading: false,
  });

  serviceInfoDetail.domainAttached.currentState.domains.forEach((domain) => {
    it(`should render ${domain.name} checkbox`, async () => {
      render(<ServiceTerminate />, { wrapper });
      await waitFor(async () => {
        const checkbox = await screen.findByTestId(`checkbox-${domain.name}`);
        const input = checkbox.querySelector('input');
        expect(input).toBeInTheDocument();
        expect(input?.checked).toBe(false);
        fireEvent.click(input!);
        expect(input?.checked).toBe(true);
      });
    });
  });

  it('should select all checkboxes when the "select all" checkbox is clicked', async () => {
    (useGetAllDom as jest.Mock).mockReturnValue({
      data: serviceInfoDetail,
      isLoading: false,
    });

    render(<ServiceTerminate />, { wrapper });

    const selectAllCheckbox = await screen.findByTestId('checkbox-alldomains');

    expect(selectAllCheckbox).toBeInTheDocument();

    fireEvent.click(selectAllCheckbox);

    await waitFor(async () => {
      await Promise.all(
        serviceInfoDetail.domainAttached.currentState.domains.map(
          async (domain) => {
            const checkbox = await screen.findByTestId(
              `checkbox-${domain.name}`,
            );
            const input = checkbox.querySelector('input');
            expect(input?.checked).toBe(true);
          },
        ),
      );
    });
  });
});
