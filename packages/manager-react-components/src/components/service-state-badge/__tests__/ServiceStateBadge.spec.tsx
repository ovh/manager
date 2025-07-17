import React from 'react';
import { vitest } from 'vitest';
import { render } from '@testing-library/react';
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
      const container = renderComponent({ state });
      const badge = container.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.textContent).toBe(label);
      expect(badge.className.includes(color)).toBe(true);
    },
  );
});
