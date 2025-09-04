import '@/common/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import ServiceTerminate from '@/alldoms/pages/service/serviceTerminate/serviceTerminate';
import {
  useGetAllDomResource,
  useGetDomainBillingInformation,
} from '@/alldoms/hooks/data/query';
import { domainBillingDetail } from '@/alldoms/__mocks__/domainBillingDetail';
import { alldomService } from '@/alldoms/__mocks__/alldomService';

vi.mock('@/alldoms/hooks/data/query', () => ({
  useGetAllDomResource: vi.fn(),
  useGetDomainBillingInformation: vi.fn(),
}));

describe('Terminate service', () => {
  it('display the modal', async () => {
    (useGetAllDomResource as jest.Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    (useGetDomainBillingInformation as jest.Mock).mockReturnValue({
      data: domainBillingDetail,
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

  (useGetAllDomResource as jest.Mock).mockReturnValue({
    data: alldomService,
    isLoading: false,
  });

  (useGetDomainBillingInformation as jest.Mock).mockReturnValue({
    data: domainBillingDetail,
    isLoading: false,
  });

  alldomService.currentState.domains.forEach((domain) => {
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
    (useGetAllDomResource as jest.Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    (useGetDomainBillingInformation as jest.Mock).mockReturnValue({
      data: domainBillingDetail,
      isLoading: false,
    });

    render(<ServiceTerminate />, { wrapper });

    const selectAllCheckbox = await screen.findByTestId('checkbox-alldomains');

    expect(selectAllCheckbox).toBeInTheDocument();

    fireEvent.click(selectAllCheckbox);

    await waitFor(async () => {
      await Promise.all(
        alldomService.currentState.domains.map(async (domain) => {
          const checkbox = await screen.findByTestId(`checkbox-${domain.name}`);
          const input = checkbox.querySelector('input');
          expect(input?.checked).toBe(true);
        }),
      );
    });
  });
});
