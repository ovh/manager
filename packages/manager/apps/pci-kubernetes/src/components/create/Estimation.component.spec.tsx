import { render } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import Estimation from './Estimation.component';
import { wrapper } from '@/wrapperRenders';

import { NodePoolPrice } from '@/api/data/kubernetes';
import { TClusterPlanEnum } from '@/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) =>
      params ? `${key} ${JSON.stringify(params)}` : key,
  }),
}));
vi.mock('@/hooks/use3azPlanAvaible', () => ({
  default: vi.fn(),
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  ...vi.importActual('@ovh-ux/manager-pci-common'),
  useCatalog: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  ...vi.importActual('@ovh-ux/manager-react-components'),
  useCatalogPrice: vi.fn(),
}));

describe('Estimation Component', () => {
  beforeEach(() => {
    vi.mocked(useCatalog).mockReturnValue({
      data: {
        addons: [
          {
            planCode: 'mks.free.hour.consumption',
            pricings: [{ price: 0 }],
          },
          {
            planCode: 'mks.standard.hour.consumption.3az',
            pricings: [{ price: 123 }],
          },
          {
            planCode: 'mks.standard.hour.consumption.4az',
            pricings: [{ price: 123 }],
          },
        ],
      },
      isPending: false,
    } as ReturnType<typeof useCatalog>);
    vi.clearAllMocks();
  });

  it('should render the estimated cost label', () => {
    (useCatalogPrice as Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: vi.fn().mockReturnValue('0.00 €'),
    });

    const { getByText } = render(<Estimation plan={TClusterPlanEnum.FREE} />, {
      wrapper,
    });

    expect(
      getByText('kube_common_node_pool_estimated_cost'),
    ).toBeInTheDocument();
  });

  it('should display all expected estimation texts', () => {
    (useCatalogPrice as Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: vi.fn().mockReturnValue('0.00 €'),
    });

    const { getByText } = render(<Estimation plan={TClusterPlanEnum.FREE} />, {
      wrapper,
    });

    expect(
      getByText('kube_common_node_pool_estimation_text'),
    ).toBeInTheDocument();
    expect(
      getByText('kube_common_node_pool_estimation_price'),
    ).toBeInTheDocument();
    expect(getByText('0.00 €')).toBeInTheDocument();
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

    (useCatalogPrice as Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: getFormattedMonthlyCatalogPriceMock,
    });

    const { getByText } = render(
      <Estimation nodePools={mockNodePools} plan={TClusterPlanEnum.FREE} />,
      {
        wrapper,
      },
    );

    expect(getFormattedMonthlyCatalogPriceMock).toHaveBeenCalledWith(30);
    expect(
      getByText('kube_common_node_pool_estimation_price'),
    ).toBeInTheDocument();
    expect(getByText('30.00 €')).toBeInTheDocument();
  });

  it('should display default price when nodePools is undefined', () => {
    const getFormattedMonthlyCatalogPriceMock = vi
      .fn()
      .mockReturnValue('x.xx €');

    (useCatalogPrice as Mock).mockReturnValue({
      getFormattedMonthlyCatalogPrice: getFormattedMonthlyCatalogPriceMock,
    });

    const { getByText } = render(<Estimation plan={TClusterPlanEnum.FREE} />, {
      wrapper,
    });

    expect(getFormattedMonthlyCatalogPriceMock).toHaveBeenCalledWith(0);
    expect(
      getByText('kube_common_node_pool_estimation_price'),
    ).toBeInTheDocument();
    expect(getByText('x.xx €')).toBeInTheDocument();
  });
});
