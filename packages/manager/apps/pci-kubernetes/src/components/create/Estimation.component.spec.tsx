import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import Estimation from './Estimation.component';
import { wrapper } from '@/wrapperRenders';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: () => ({
    getFormattedMonthlyCatalogPrice: (price: number) => `${price} €/mois`,
    getFormattedHourlyCatalogPrice: (price: number) => `${price} €/h`,
  }),
}));

describe('Estimation Component', () => {
  it('should render the estimated cost label', () => {
    const { getByText } = render(
      <Estimation price={100} monthlyPrice={2000} />,
      { wrapper },
    );

    expect(
      getByText('kube_common_node_pool_estimated_cost'),
    ).toBeInTheDocument();
  });

  it('should display the formatted hourly and monthly prices', () => {
    const { getByText } = render(
      <Estimation price={100} monthlyPrice={2000} />,
      { wrapper },
    );

    expect(getByText('100 €/h')).toBeInTheDocument();
    expect(getByText('2000 €/mois')).toBeInTheDocument();
  });

  it('should handle default props correctly', () => {
    const { getByText } = render(<Estimation />, { wrapper });

    expect(getByText('0 €/h')).toBeInTheDocument();
    expect(getByText('0 €/mois')).toBeInTheDocument();
  });
});
