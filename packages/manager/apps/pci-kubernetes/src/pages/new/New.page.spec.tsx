import { useHref, useNavigate, useParams } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useProject } from '@ovh-ux/manager-pci-common';

import { useCreateKubernetesCluster } from '@/api/hooks/useKubernetes';
import { wrapper } from '@/wrapperRenders';

import NewPage from './New.page';
import { useClusterCreationStepper } from './hooks/useCusterCreationStepper';

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

vi.mock('./hooks/useCusterCreationStepper', () => ({
  useClusterCreationStepper: vi.fn(),
}));

vi.mock('@/api/hooks/useKubernetes', () => ({
  useCreateKubernetesCluster: vi.fn(),
}));

describe('NewPage', () => {
  const mockNavigate = vi.fn();
  const mockUseHref = vi.fn();
  const mockUseParams = vi.fn();

  const mockUseProject = vi.fn();
  const mockUseClusterCreationStepper = vi.fn();
  const mockUseCreateKubernetesCluster = vi.fn();

  beforeEach(() => {
    mockUseHref.mockReturnValue('..');
    mockUseParams.mockReturnValue({ projectId: '123' });

    mockUseProject.mockReturnValue({
      data: { project_id: '123', description: 'Test Project' },
    });
    mockUseClusterCreationStepper.mockReturnValue({
      clusterName: {
        step: { isLocked: false, unlock: vi.fn() },
        update: vi.fn(),
        submit: vi.fn(),
        edit: vi.fn(),
      },
      location: {
        step: { isLocked: false },
        submit: vi.fn(),
        edit: vi.fn(),
      },
      plan: {
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
      node: {
        step: { isLocked: false },
        edit: vi.fn(),
      },
      confirm: {
        step: { isLocked: false, lock: vi.fn() },
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
          privateNetwork: { clusterRegion: { id: '123' } },
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
    vi.mocked(useClusterCreationStepper).mockImplementation(mockUseClusterCreationStepper);
    vi.mocked(useCreateKubernetesCluster).mockImplementation(mockUseCreateKubernetesCluster);
  });

  it('renders the component correctly', async () => {
    render(<NewPage />, { wrapper });
    expect(screen.getByText('kubernetes_add')).toBeInTheDocument();
    expect(screen.getByText('kubernetes_add_name_title')).toBeInTheDocument();
    expect(screen.getByText('kubernetes_add_region_title')).toBeInTheDocument();
    expect(screen.getByText('kubernetes_add_version_and_upgrade_policy_title')).toBeInTheDocument();
    expect(screen.getByText('listing:kubernetes_add_private_network')).toBeInTheDocument();
  });
});
