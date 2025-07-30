import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { alldomService } from '@/alldoms/__mocks__/alldomService';
import { useGetAllDomResource } from '@/alldoms/hooks/data/query';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { allDomTerminate } from '@/alldoms/mocks/allDomTerminate';
import ServiceTerminate from '@/alldoms/pages/service/service-terminate/serviceTerminate';
import { wrapper } from '@/alldoms/utils/test.provider';

vi.mock('@/alldoms/hooks/data/query', () => ({
  useGetAllDomResource: vi.fn(),
}));

vi.mock('@/alldoms/hooks/data/useGetServices', () => ({
  useGetServices: vi.fn(),
}));

describe('Terminate service', () => {
  it('display the modal', async () => {
    (useGetAllDomResource as jest.Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    (useGetServices as jest.Mock).mockReturnValue({
      data: allDomTerminate,
      isLoading: false,
    });

    render(<ServiceTerminate />, { wrapper });
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('allDom_modal_subtitle')).toBeInTheDocument();
      expect(screen.getByText('allDom_modal_choice')).toBeInTheDocument();
      expect(screen.getByText('allDom_modal_step_one_message')).toBeInTheDocument();
    });
  });

  (useGetAllDomResource as jest.Mock).mockReturnValue({
    data: alldomService,
    isLoading: false,
  });

  (useGetServices as jest.Mock).mockReturnValue({
    data: allDomTerminate,
    isLoading: false,
  });

  allDomTerminate.forEach((domain) => {
    it(`should render ${domain.resource.name} checkbox`, async () => {
      render(<ServiceTerminate />, { wrapper });
      await waitFor(async () => {
        const checkbox = await screen.findByTestId(`checkbox-${domain.resource.name}`);
        const input = checkbox.querySelector('input');
        expect(input).toBeInTheDocument();
        expect(input?.checked).toBe(false);
        fireEvent.click(input);
        expect(input?.checked).toBe(true);
      });
    });
  });

  it('should select all checkboxes when the "select all" checkbox is clicked', async () => {
    (useGetAllDomResource as jest.Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    (useGetServices as jest.Mock).mockReturnValue({
      data: allDomTerminate,
      isLoading: false,
    });

    render(<ServiceTerminate />, { wrapper });

    const selectAllCheckbox = await screen.findByTestId('checkbox-alldomains');

    expect(selectAllCheckbox).toBeInTheDocument();

    fireEvent.click(selectAllCheckbox);

    await waitFor(async () => {
      await Promise.all(
        allDomTerminate.map(async (domain) => {
          const checkbox = await screen.findByTestId(`checkbox-${domain.resource.name}`);
          const input = checkbox.querySelector('input');
          expect(input?.checked).toBe(true);
        }),
      );
    });
  });
});
