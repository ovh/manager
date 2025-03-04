import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { DeploymentModeStep } from './DeploymentModeStep.component';
import { wrapper } from '@/wrapperRenders';

describe('DeploymentModeStep', () => {
  it('should display correctly', () => {
    const { container } = render(<DeploymentModeStep />, {
      wrapper,
    });
    expect(container).toMatchSnapshot();
  });
});
