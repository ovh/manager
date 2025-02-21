import { render } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import Estimation from './Estimation.component';
import { wrapper } from '@/wrapperRenders';

import { NodePoolPrice } from '@/api/data/kubernetes';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) =>
      params ? `${key} ${JSON.stringify(params)}` : key,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: vi.fn(),
}));

describe('Estimation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the estimated cost label', () => {
    (useCatalogPrice as jest.Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: vi.fn().mockReturnValue('x.xx €'),
    });

    const { getByText } = render(<Estimation />, { wrapper });

    expect(
      getByText('kube_common_node_pool_estimated_cost'),
    ).toBeInTheDocument();
  });

  it('should display all expected estimation texts', () => {
    (useCatalogPrice as jest.Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: vi.fn().mockReturnValue('x.xx €'),
    });

    const { getByText } = render(<Estimation />, { wrapper });

    expect(
      getByText('kube_common_node_pool_estimation_text'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'kube_common_node_pool_estimation_price {"estimation":"x.xx €"}',
      ),
    ).toBeInTheDocument();
    expect(
      getByText('kube_common_node_pool_estimation_text_end'),
    ).toBeInTheDocument();
  });

  it('should correctly calculate the estimated price from nodePools', () => {
    const mockNodePools: NodePoolPrice[] = [
      { monthlyPrice: 10 },
      { monthlyPrice: 20 },
    ] as NodePoolPrice[];

    const getFormattedMonthlyCatalogPriceMock = vi
      .fn()
      .mockReturnValue('30.00 €');

    (useCatalogPrice as jest.Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: getFormattedMonthlyCatalogPriceMock,
    });

    const { getByText } = render(<Estimation nodePools={mockNodePools} />, {
      wrapper,
    });

    expect(getFormattedMonthlyCatalogPriceMock).toHaveBeenCalledWith(30);
    expect(
      getByText(
        'kube_common_node_pool_estimation_price {"estimation":"30.00 €"}',
      ),
    ).toBeInTheDocument();
  });

  it('should display default price when nodePools is undefined', () => {
    const getFormattedMonthlyCatalogPriceMock = vi
      .fn()
      .mockReturnValue('x.xx €');

    (useCatalogPrice as jest.Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: getFormattedMonthlyCatalogPriceMock,
    });

    const { getByText } = render(<Estimation />, { wrapper });

    expect(getFormattedMonthlyCatalogPriceMock).toHaveBeenCalledWith(0);
    expect(
      getByText(
        'kube_common_node_pool_estimation_price {"estimation":"x.xx €"}',
      ),
    ).toBeInTheDocument();
  });
});
