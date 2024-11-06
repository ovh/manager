import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import ClusterInformation from '@/components/service/ClusterInformation.component';
import { TKube } from '@/types';

const renderClusterInformation = (kubeDetail) =>
  render(<ClusterInformation kubeDetail={kubeDetail} />);

describe('ClusterInformation', () => {
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

  it('renders cluster information correctly', () => {
    renderClusterInformation(kubeDetail);

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
