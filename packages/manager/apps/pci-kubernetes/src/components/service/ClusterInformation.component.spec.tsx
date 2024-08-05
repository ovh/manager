import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import ClusterInformation from '@/components/service/ClusterInformation.component';
import { TKube } from '@/types';

describe('ClusterInformation', () => {
  it('renders cluster information title with correct text', () => {
    const { getByText } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(getByText(/kube_service_cluster_information/i)).toBeInTheDocument();
  });

  it('renders cluster ID with clipboard component', () => {
    const { getByTestId } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(getByTestId('clusterInformation-clipboardKubeId')).toHaveAttribute(
      'value',
      '1',
    );
  });

  it('renders cluster name correctly', () => {
    const { getByText } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(getByText('Cluster1')).toBeInTheDocument();
  });

  it('renders cluster status correctly', () => {
    const { getByText } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(getByText('kube_service_cluster_status_READY')).toBeInTheDocument();
  });

  it('renders cluster version correctly', () => {
    const { getByText } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(getByText('1.18')).toBeInTheDocument();
  });

  it('renders public network information correctly', () => {
    const { getByText } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(
      getByText(/pci_kubernetes_network_data_public/i),
    ).toBeInTheDocument();
  });

  it('renders private network information correctly', () => {
    const { getByText } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: {
              privateNetworkRoutingAsDefault: true,
              defaultVrackGateway: '192.168.1.1',
            },
          } as TKube
        }
      />,
    );
    expect(
      getByText(/pci_kubernetes_network_data_private/i),
    ).toBeInTheDocument();
    expect(getByText(/pci_kubernetes_network_data_ip/i)).toBeInTheDocument();
    expect(getByText(/192.168.1.1/i)).toBeInTheDocument();
  });

  it('renders cluster region correctly', () => {
    const { getByText } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(getByText('Region1')).toBeInTheDocument();
  });

  it('renders nodes URL with clipboard component', () => {
    const { getByTestId } = render(
      <ClusterInformation
        kubeDetail={
          {
            id: '1',
            name: 'Cluster1',
            status: 'READY',
            version: '1.18',
            attachedTo: 'Network1',
            region: 'Region1',
            nodesUrl: 'http://nodes.url',
            privateNetworkConfiguration: null,
          } as TKube
        }
      />,
    );
    expect(getByTestId('clusterInformation-clipboardNodeUrls')).toHaveAttribute(
      'value',
      'http://nodes.url',
    );
  });
});
