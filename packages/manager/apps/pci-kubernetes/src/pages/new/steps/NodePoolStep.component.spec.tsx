import { QueryObserverSuccessResult } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { DeploymentMode } from '@/types';
import { TRegionInformations } from '@/types/region';
import { wrapper } from '@/wrapperRenders';

import { useClusterCreationStepper } from '../hooks/useCusterCreationStepper';
import NodePoolStep from './NodePoolStep.component';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: '12345' }),
}));

vi.mock('../hooks/useCusterCreationStepper', () => ({
  useClusterCreationStepper: vi.fn(),
}));
//
vi.mock('@ovh-ux/manager-react-components', async (original) => ({
  ...(await original()),
  useProjectUrl: vi.fn(),
}));

vi.mock('@/api/hooks/useRegionInformations', () => ({
  useRegionInformations: vi.fn(),
}));

const mockStepper = {
  node: {
    step: {
      isLocked: false,
    },
    submit: vi.fn(),
  },
  form: {
    region: {
      name: 'eu-west-1',
    },
  },
} as unknown as ReturnType<typeof useClusterCreationStepper>;

describe('NodePoolStep Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClusterCreationStepper).mockReturnValue(mockStepper);
    vi.mocked(useRegionInformations).mockReturnValue({
      data: {
        type: DeploymentMode.MONO_ZONE,
        availabilityZones: ['zone-a', 'zone-b'],
      },
    } as QueryObserverSuccessResult<TRegionInformations, Error>);
  });

  it('should render without error', () => {
    render(<NodePoolStep stepper={mockStepper} />, { wrapper });
    const toTest = [
      'kubernetes_add_nodepool_name_placeholder',
      'kube_common_node_pool_model_type_selector',
      'kube_common_node_pool_size_title',
      'kubernetes_node_pool_anti_affinity',
      'flavor-billing:pci_projects_project_instances_configure_billing_type',
      'node-pool:kube_common_add_node_pool',
    ];
    toTest.forEach((test) => expect(screen.getByText(test)).toBeInTheDocument());
  });

  it('should render zones', () => {
    render(<NodePoolStep stepper={mockStepper} />, { wrapper });
  });
});
