import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';

import { DeploymentModeStep } from './DeploymentModeStep.component';
import { wrapperShow } from '@/wrapperRenders';

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
