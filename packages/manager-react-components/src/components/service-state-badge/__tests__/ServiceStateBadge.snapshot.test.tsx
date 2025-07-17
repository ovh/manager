import React from 'react';
import { vitest } from 'vitest';
import { render } from '@testing-library/react';
import { ResourceStatus } from '../../../hooks';
import { ServiceStateBadge } from '../ServiceStateBadge.component';
import { SERVICE_STATES } from './ServiceStateBadge.spec.util';

vitest.mock('../../hooks/iam');

const renderComponent = (
  props: React.ComponentProps<typeof ServiceStateBadge>,
) => {
  return render(<ServiceStateBadge {...props} data-testid="badge" />);
};

describe('should display manager state with the good color', () => {
  it.each(SERVICE_STATES)(
    `should display manager $state badge for $color`,
    ({ state, label, color }) => {
      const { container } = renderComponent({ state });
      expect(container).toMatchSnapshot();
    },
  );

  it(`should display loading Badge`, () => {
    const { container } = renderComponent({
      isLoading: true,
      state: 'unknown' as ResourceStatus,
    });
    expect(container).toMatchSnapshot();
  });
});
