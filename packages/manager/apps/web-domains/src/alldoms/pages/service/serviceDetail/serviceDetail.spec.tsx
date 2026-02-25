import '@/common/setupTests';
import { Mock, vi, expect } from 'vitest';
import { render, waitFor } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';
import ServiceDetail from '@/alldoms/pages/service/serviceDetail/serviceDetail';
import { alldomService } from '@/alldoms/__mocks__/alldomService';

vi.mock('@/alldoms/hooks/data/useGetAllDom', () => ({
  useGetAllDom: vi.fn(),
}));

describe('AllDom datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useGetAllDom as Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    const { getByTestId, container } = render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
    });

    await expect(container).toBeAccessible({
      rules: {
        'aria-progressbar-name': { enabled: false },
      },
    });
  });

  it('display the information general pack', async () => {
    (useGetAllDom as Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    const { getByTestId, container } = render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(getByTestId('ServiceDetailInformation')).toBeInTheDocument();
    });

    await expect(container).toBeAccessible({
      rules: {
        'aria-progressbar-name': { enabled: false },
        'aria-prohibited-attr': { enabled: false },
        'button-name': { enabled: false },
        'heading-order': { enabled: false },
      },
    });
  });
});
