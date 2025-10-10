import { useHref } from 'react-router-dom';

import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import ClusterVersionUpgradeBanner from '@/components/service/ClusterVersionUpgradeBanner.component';

describe('ClusterVersionUpgradeBanner', () => {
  it('renders warning message with correct text', () => {
    const { getByText } = render(<ClusterVersionUpgradeBanner />);
    expect(getByText(/kube_service_cluster_version_not_supported_message/i)).toBeInTheDocument();
  });

  it('renders upgrade button with correct text', () => {
    const { getByText } = render(<ClusterVersionUpgradeBanner />);
    expect(getByText(/kube_service_minor_version_upgrade/i)).toBeInTheDocument();
  });

  it('renders upgrade button with correct href', () => {
    vi.mocked(useHref).mockReturnValueOnce('./update');
    const { getByTestId } = render(<ClusterVersionUpgradeBanner />);
    expect(getByTestId('upgradeBanner-button')).toHaveAttribute('href', './update');
  });
});
