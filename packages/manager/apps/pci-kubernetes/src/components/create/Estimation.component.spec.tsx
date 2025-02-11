import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import Estimation from './Estimation.component';
import { wrapper } from '@/wrapperRenders';

describe('Estimation Component', () => {
  it('should render the estimated cost label', () => {
    const { getByText } = render(<Estimation />, { wrapper });

    expect(
      getByText('kube_common_node_pool_estimated_cost'),
    ).toBeInTheDocument();
  });

  it('should display all expected estimation texts', () => {
    const { getByText } = render(<Estimation />, { wrapper });

    expect(
      getByText('kube_common_node_pool_estimation_text'),
    ).toBeInTheDocument();
    expect(
      getByText('kube_common_node_pool_estimation_price'),
    ).toBeInTheDocument();
    expect(
      getByText('kube_common_node_pool_estimation_text_end'),
    ).toBeInTheDocument();
  });
});
