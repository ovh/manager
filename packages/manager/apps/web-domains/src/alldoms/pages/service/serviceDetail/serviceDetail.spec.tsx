import '@/common/setupTests';
import { Mock, vi, expect, describe, it } from 'vitest';
import { render, waitFor } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';
import ServiceDetail from '@/alldoms/pages/service/serviceDetail/serviceDetail';
import { alldomService } from '@/alldoms/__mocks__/alldomService';
import { serviceInfo } from '@/alldoms/__mocks__/serviceInfo';

vi.mock('@/alldoms/hooks/data/useGetAllDom', () => ({
  useGetAllDom: vi.fn(),
}));

vi.mock('@/alldoms/hooks/data/useGetServices', () => ({
  useGetServices: vi.fn(() => ({
    data: [],
    listLoading: false,
  })),
}));

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(() => ({
    serviceInfo,
    isServiceInfoLoading: false,
  })),
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

describe('AllDom datagrid W3C Validation', () => {
  it('should have valid html when loading', async () => {
    (useGetAllDom as Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    const { container } = render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(
        container.querySelector('[data-testid="listing-page-spinner"]'),
      ).toBeInTheDocument();
    });

    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });

  it('should have valid html when loaded', async () => {
    (useGetAllDom as Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    const { container } = render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(
        container.querySelector('[data-testid="ServiceDetailInformation"]'),
      ).toBeInTheDocument();
    });

    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
