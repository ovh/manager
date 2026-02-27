import '@/common/setupTests';
import { Mock, vi, expect } from 'vitest';
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import ServiceTerminate from '@/alldoms/pages/service/serviceTerminate/serviceTerminate';
import { useGetAllDomResource } from '@/alldoms/hooks/data/query';
import { alldomService } from '@/alldoms/__mocks__/alldomService';
import { allDomTerminate } from '@/alldoms/__mocks__/allDomTerminate';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';

vi.mock('@/alldoms/hooks/data/query', () => ({
  useGetAllDomResource: vi.fn(),
}));

vi.mock('@/alldoms/hooks/data/useGetServices', () => ({
  useGetServices: vi.fn(),
}));

describe('Terminate service', () => {
  it('display the modal', async () => {
    (useGetAllDomResource as Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    (useGetServices as Mock).mockReturnValue({
      data: allDomTerminate,
      isLoading: false,
    });

    const { container } = render(<ServiceTerminate />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('allDom_modal_subtitle')).toBeInTheDocument();
      expect(screen.getByText('allDom_modal_choice')).toBeInTheDocument();
      expect(
        screen.getByText('allDom_modal_step_one_message'),
      ).toBeInTheDocument();
    });

    await expect(container).toBeAccessible();
  });

  allDomTerminate.forEach((domain) => {
    it(`should render ${domain.resource.name} checkbox`, async () => {
      (useGetAllDomResource as Mock).mockReturnValue({
        data: alldomService,
        isLoading: false,
      });

      (useGetServices as Mock).mockReturnValue({
        data: allDomTerminate,
        isLoading: false,
      });

      const { container } = render(<ServiceTerminate />, { wrapper });
      await waitFor(async () => {
        const checkbox = await screen.findByTestId(
          `checkbox-${domain.resource.name}`,
        );
        const input = checkbox.querySelector('input');
        expect(input).toBeInTheDocument();
        expect(input?.checked).toBe(false);
        fireEvent.click(input!);
        expect(input?.checked).toBe(true);
      });
      await expect(container).toBeAccessible();
    });
  });

  it('should select all checkboxes when the "select all" checkbox is clicked', async () => {
    (useGetAllDomResource as Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    (useGetServices as Mock).mockReturnValue({
      data: allDomTerminate,
      isLoading: false,
    });

    const { container } = render(<ServiceTerminate />, { wrapper });

    const selectAllCheckbox = await screen.findByTestId('checkbox-alldomains');

    expect(selectAllCheckbox).toBeInTheDocument();

    fireEvent.click(selectAllCheckbox);

    await waitFor(async () => {
      await Promise.all(
        allDomTerminate.map(async (domain) => {
          const checkbox = await screen.findByTestId(
            `checkbox-${domain.resource.name}`,
          );
          const input = checkbox.querySelector('input');
          expect(input?.checked).toBe(true);
        }),
      );
    });

    await expect(container).toBeAccessible();
  });
});
