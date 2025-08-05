import React from 'react';
import { vitest } from 'vitest';
import { ResourceStatus } from '../../hooks';
import { render } from '../../utils/test.provider';
import { ServiceStateBadge } from './ServiceStateBadge.component';

vitest.mock('../../hooks/iam');

const renderComponent = (
  props: React.ComponentProps<typeof ServiceStateBadge>,
) => {
  return render(<ServiceStateBadge {...props} data-testid="badge" />);
};

describe('should display manager state with the good color', () => {
  it.each([
    {
      state: 'active',
      label: 'service_state_active',
      color: 'success',
    } as const,
    {
      state: 'deleted',
      label: 'service_state_deleted',
      color: 'critical',
    } as const,
    {
      state: 'unknown' as ResourceStatus,
      label: 'unknown',
      color: 'information',
    } as const,
  ])(
    `should display manager $state badge for $color`,
    ({ state, label, color }) => {
      const container = renderComponent({ state });
      const badge = container.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.getAttribute('label')).toBe(label);
      expect(badge.getAttribute('color')).toBe(color);
    },
  );
});
