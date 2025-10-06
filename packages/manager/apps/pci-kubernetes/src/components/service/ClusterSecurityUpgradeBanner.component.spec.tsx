import { useHref } from 'react-router-dom';

import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import ClusterSecurityUpgradeBanner from '@/components/service/ClusterSecurityUpgradeBanner.component';

describe('ClusterSecurityUpgradeBanner', () => {
  it('renders info message with correct text', () => {
    const { getByText } = render(<ClusterSecurityUpgradeBanner />);
    expect(getByText(/kube_service_cluster_update_available/i)).toBeInTheDocument();
  });

  it('renders update button with correct text', () => {
    const { getByText } = render(<ClusterSecurityUpgradeBanner />);
    expect(getByText(/kube_service_common_update/i)).toBeInTheDocument();
  });

  it('renders update button with correct href', () => {
    vi.mocked(useHref).mockReturnValueOnce('./update?forceVersion');
    const { getByTestId } = render(<ClusterSecurityUpgradeBanner />);
    expect(getByTestId('upgradeBanner-button')).toHaveAttribute('href', './update?forceVersion');
  });
});
