import { render, screen, waitFor, act } from '@testing-library/react';
import * as manager from '@ovh-ux/manager-react-components';
import { describe, it, expect, vi } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import ClusterInformation from '@/components/service/ClusterInformation.component';
import { wrapper } from '@/wrapperRenders';
import { TKube } from '@/types';
import * as ApiKube from '@/api/data/kubernetes';

const renderClusterInformation = (kubeDetail) =>
  render(<ClusterInformation kubeDetail={kubeDetail} />, { wrapper });

describe('ClusterInformation', () => {
  const mockData = { usage: 500, quota: 1024 };
  vi.spyOn(ApiKube, 'getKubeEtcdUsage').mockResolvedValueOnce(mockData);

  const kubeDetail = {
    id: '1',
    name: 'Cluster1',
    status: 'READY',
    version: '1.18',
    attachedTo: 'Network1',
    region: 'Region1',
    customization: {
      apiServer: {
        admissionPlugins: {
          disabled: ['NodeRestriction'],
          enabled: ['AlwaysPullImages'],
        },
      },
    },
    nodesUrl: 'http://nodes.url',
    privateNetworkConfiguration: null,
    plugins: [
      {
        name: 'NodeRestriction',
        state: 'disabled',
        tip: 'node_restrictions_tip',
      },
      { name: 'AlwaysPullImages', state: 'enabled' },
    ],
  } as TKube;

  it.skip('calls clearNotifications on unmount', async () => {
    const { unmount } = renderClusterInformation(kubeDetail);
    const mockClearNotifications = vi.fn();

    vi.spyOn(manager, 'useNotifications').mockReturnValue({
      clearNotifications: mockClearNotifications,
    });
    expect(mockClearNotifications).not.toHaveBeenCalled();
    act(() => unmount());
    // not working issue
    // https://github.com/testing-library/react-hooks-testing-library/issues/847
    expect(mockClearNotifications).toHaveBeenCalledTimes(1);
  });

  it('renders cluster information correctly', async () => {
    renderClusterInformation(kubeDetail);

    await waitFor(() => {
      expect(
        screen.getByText(/kube_service_cluster_information/i),
      ).toBeInTheDocument();
      expect(screen.getByText('Cluster1')).toBeInTheDocument();
      expect(
        screen.getByText('kube_service_cluster_status_READY'),
      ).toBeInTheDocument();
      expect(screen.getByText('1.18')).toBeInTheDocument();

      expect(
        screen.getByTestId('admission-plugin-chip AlwaysPullImages'),
      ).toHaveProperty('color', ODS_THEME_COLOR_INTENT.success);
      expect(
        screen.getByTestId('admission-plugin-chip NodeRestriction'),
      ).toHaveProperty('color', ODS_THEME_COLOR_INTENT.warning);
      expect(screen.getByText('Region1')).toBeInTheDocument();
    });
  });

  it('renders cluster ID with clipboard component', () => {
    const { container } = renderClusterInformation({
      ...kubeDetail,
      id: 'id-1',
    });
    const clipboardElement = container.querySelector('[value="id-1"]');
    expect(clipboardElement).toBeVisible();
  });

  it('renders nodes URL with clipboard component', () => {
    const { container } = renderClusterInformation(kubeDetail);
    const clipboardElement = container.querySelector(
      '[value="http://nodes.url"]',
    );
    expect(clipboardElement).toBeVisible();
  });
});
