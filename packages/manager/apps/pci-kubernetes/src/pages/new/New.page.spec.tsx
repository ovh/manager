import { render, screen, waitFor } from '@testing-library/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { vi } from 'vitest';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useClusterCreationStepper } from './useCusterCreationStepper';
import { useCreateKubernetesCluster } from '@/api/hooks/useKubernetes';
import NewPage from './New.page';
import { wrapper } from '@/wrapperRenders';

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock('@ovh-ux/manager-pci-common', async (actual) => ({
  ...(await actual()),
  isDiscoveryProject: vi.fn(),
  useProject: vi.fn(),
}));

vi.mock('./useCusterCreationStepper', () => ({
  useClusterCreationStepper: vi.fn(),
}));

vi.mock('@/api/hooks/useKubernetes', () => ({
  useCreateKubernetesCluster: vi.fn(),
}));

describe('NewPage', () => {
  const mockNavigate = vi.fn();
  const mockUseHref = vi.fn();
  const mockUseParams = vi.fn();
  const mockUseTranslation = vi.fn();
  const mockUseProject = vi.fn();
  const mockUseClusterCreationStepper = vi.fn();
  const mockUseCreateKubernetesCluster = vi.fn();

  beforeEach(() => {
    // Mock the return values of the hooks
    mockUseHref.mockReturnValue('..');
    mockUseParams.mockReturnValue({ projectId: '123' });
    mockUseTranslation.mockReturnValue({
      t: (key) => key,
    });
    mockUseProject.mockReturnValue({
      data: { project_id: '123', description: 'Test Project' },
    });
    mockUseClusterCreationStepper.mockReturnValue({
      clusterName: {
        step: { isLocked: false, unlock: vi.fn() },
        update: vi.fn(),
        submit: vi.fn(),
      },
      location: {
        step: { isLocked: false },
        submit: vi.fn(),
        edit: vi.fn(),
      },
      version: {
        step: { isLocked: false },
        submit: vi.fn(),
        edit: vi.fn(),
      },
      network: {
        step: { isLocked: false },
        submit: vi.fn(),
        edit: vi.fn(),
      },
      nodeType: {
        step: { isLocked: false },
        submit: vi.fn(),
        edit: vi.fn(),
      },
      nodeSize: {
        step: { isLocked: false },
        submit: vi.fn(),
        edit: vi.fn(),
      },
      billing: {
        step: { isLocked: false },
        submit: vi.fn(),
        edit: vi.fn(),
      },
      form: {
        clusterName: 'test-cluster',
        region: { name: 'GRA' },
        version: '1.24',
        updatePolicy: 'automatic',
        antiAffinity: true,
        scaling: {
          isAutoscale: true,
          quantity: { desired: 3, min: 1, max: 5 },
        },
        flavor: { name: 'b2-7' },
        isMonthlyBilled: true,
        network: {
          privateNetwork: { clusterRegion: { openstackId: '123' } },
          loadBalancersSubnet: { id: '456' },
          subnet: { id: '789' },
          gateway: { ip: '192.168.1.1', isEnabled: true },
        },
      },
    });
    mockUseCreateKubernetesCluster.mockReturnValue({
      createCluster: vi.fn(),
      isPending: false,
    });

    // Assign the mocked functions to the respective hooks
    vi.mocked(useHref).mockImplementation(mockUseHref);
    vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
    vi.mocked(useParams).mockImplementation(mockUseParams);

    vi.mocked(useProject).mockImplementation(mockUseProject);
    vi.mocked(useClusterCreationStepper).mockImplementation(
      mockUseClusterCreationStepper,
    );
    vi.mocked(useCreateKubernetesCluster).mockImplementation(
      mockUseCreateKubernetesCluster,
    );
  });

  it('renders the component correctly', async () => {
    render(<NewPage />, { wrapper });

    // Check if the title is rendered
    expect(screen.getByText('kubernetes_add')).toBeInTheDocument();

    // Check if the steps are rendered
    expect(screen.getByText('kubernetes_add_name_title')).toBeInTheDocument();
    expect(screen.getByText('kubernetes_add_region_title')).toBeInTheDocument();
    expect(
      screen.getByText('kubernetes_add_version_and_upgrade_policy_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('kubernetes_add_private_network'),
    ).toBeInTheDocument();
    expect(screen.getByText('kube_common_node_pool_title')).toBeInTheDocument();
    expect(
      screen.getByText('kube_common_node_pool_autoscaling_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('kubernetes_add_billing_anti_affinity_title'),
    ).toBeInTheDocument();
  });
});
