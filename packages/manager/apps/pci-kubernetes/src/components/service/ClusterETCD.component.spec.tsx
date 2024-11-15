import { render, waitFor } from '@testing-library/react';
import * as manager from '@ovh-ux/manager-react-components';
import { vi } from 'vitest';
import { UseSuspenseQueryResult } from '@tanstack/react-query';
import ClusterEtcd from './ClusterETCD.component';
import { wrapper } from '@/wrapperRenders';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { formatBytes, getColorByPercentage } from '@/helpers';

describe('ClusterEtcd', () => {
  it('renders progress bar and usage text correctly', async () => {
    const mockUsage = 500;
    const mockQuota = 1000;
    const mockPercentage = (mockUsage / mockQuota) * 100;

    vi.spyOn(useKubernetesModule, 'useGetClusterEtcdUsage').mockReturnValue(({
      data: { usage: mockUsage, quota: mockQuota },
      isPending: false,
    } as unknown) as UseSuspenseQueryResult<{ usage: number; quota: number }>);

    const { getByText, container } = render(<ClusterEtcd />, { wrapper });

    await waitFor(() => {
      const progressBar = container.querySelector('osds-progress-bar');
      const progressBarColor = getColorByPercentage(mockPercentage);

      expect(progressBar).toBeInTheDocument();
      expect(progressBar?.getAttribute('color')).toBe(progressBarColor);
      expect(progressBar?.getAttribute('value')).toBe(
        mockPercentage.toString(),
      );
      expect(
        getByText(`${formatBytes(mockUsage)} / ${formatBytes(mockQuota)}`),
      ).toBeInTheDocument();
    });
  });

  it('applies correct styles based on progress percentage', async () => {
    const mockUsage = 700;
    const mockQuota = 1000;
    const mockPercentage = (mockUsage / mockQuota) * 100;

    vi.spyOn(useKubernetesModule, 'useGetClusterEtcdUsage').mockReturnValue(({
      data: { usage: mockUsage, quota: mockQuota },
      isPending: false,
    } as unknown) as UseSuspenseQueryResult<{ usage: number; quota: number }>);

    const { container } = render(<ClusterEtcd />, { wrapper });

    await waitFor(() => {
      const progressBar = container.querySelector('osds-progress-bar');
      const progressBarStyle = getColorByPercentage(mockPercentage);

      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveProperty('color', progressBarStyle);
    });
  });

  it('renders correct usage and quota information', async () => {
    const mockUsage = 300;
    const mockQuota = 600;

    vi.spyOn(useKubernetesModule, 'useGetClusterEtcdUsage').mockReturnValue(({
      data: { usage: mockUsage, quota: mockQuota },
      isPending: false,
    } as unknown) as UseSuspenseQueryResult<{ usage: number; quota: number }>);

    const { getByText } = render(<ClusterEtcd />, { wrapper });

    await waitFor(() => {
      expect(
        getByText(`${formatBytes(mockUsage)} / ${formatBytes(mockQuota)}`),
      ).toBeInTheDocument();
    });
  });
  it('should call addError only once when percentage is over 80%', async () => {
    const mockUsage = 550;
    const mockQuota = 600;
    const addWarning = vi.fn();
    vi.spyOn(manager, 'useNotifications').mockReturnValue({
      addWarning,
    });

    // Mock useGetClusterEtcdUsage to return usage leading to percentage > 80%
    vi.spyOn(useKubernetesModule, 'useGetClusterEtcdUsage').mockReturnValue(({
      data: { usage: mockUsage, quota: mockQuota },
      isPending: false,
    } as unknown) as UseSuspenseQueryResult<{ usage: number; quota: number }>);

    // Render the component
    render(<ClusterEtcd />);
    await waitFor(() => expect(addWarning).toHaveBeenCalledTimes(1));
    // Check that addWarning is called only once
  });
});
