import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import NodePoolStep from './NodePoolStep.component';
import { useClusterCreationStepper } from '../useCusterCreationStepper';

import { wrapper } from '@/wrapperRenders';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'fr-FR',
    },
  }),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: '12345' }),
}));

vi.mock('../useCusterCreationStepper', () => ({
  useClusterCreationStepper: vi.fn(),
}));
//
vi.mock('@ovh-ux/manager-react-components', async (original) => ({
  ...((await original()) as Record<string, unknown>),
  useProjectUrl: vi.fn(),
}));

const mockStepper = ({
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
} as unknown) as ReturnType<typeof useClusterCreationStepper>;

describe('NodePoolStep Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClusterCreationStepper).mockReturnValue(mockStepper);
  });

  it('shoukld render withoit error', () => {
    render(<NodePoolStep stepper={mockStepper} />, { wrapper });
    expect(
      screen.getByText('node-pool:kube_common_add_node_pool'),
    ).toBeInTheDocument();
  });
});
