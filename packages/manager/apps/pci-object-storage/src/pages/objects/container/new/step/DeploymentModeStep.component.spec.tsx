import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';

import { DeploymentModeStep } from './DeploymentModeStep.component';
import { wrapperShow } from '@/wrapperRenders';

vi.mock('@/hooks/useFeatureAvailability', () => ({
  useFeatureAvailability: vi.fn(() => ({
    data: {
      'storage:standard-infrequent-access': true,
    },
  })),
}));

vi.mock('@/hooks/useStandardInfrequentAccessAvailability', () => ({
  default: vi.fn(() => true),
}));

vi.mock('@/constants', async () => {
  const actual = await vi.importActual('@/constants');
  return {
    ...actual,
    standardInfrequentAcess: 'storage:standard-infrequent-access',
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useOvhTracking: () => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    }),
  };
});

describe('DeploymentModeStep', () => {
  it('should display correctly', () => {
    const { container } = render(<DeploymentModeStep />, {
      wrapper: wrapperShow,
    });
    expect(container).toMatchSnapshot();
  });
});
