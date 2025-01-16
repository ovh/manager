import fr_FR from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/service/Messages_fr_FR.json';
import { ResourceStatus } from '@ovh-ux/manager-module-common-api';
import React from 'react';
import { vitest } from 'vitest';
import { render } from '../../utils/test.provider';
import { ServiceStateBadge } from './ServiceStateBadge';

vitest.mock('../../hooks/iam');

const renderComponent = (
  props: React.ComponentProps<typeof ServiceStateBadge>,
) => {
  return render(<ServiceStateBadge {...props} data-testid="badge" />);
};

describe('should display manager state with the good color', () => {
  it.each([
    { state: 'active', label: fr_FR.service_state_active, color: 'success' },
    { state: 'deleted', label: fr_FR.service_state_deleted, color: 'critical' },
    { state: 'unknown', label: 'unknown', color: 'information' },
  ])(
    `'should display manager state badge for $color`,
    ({ state, label, color }) => {
      const container = renderComponent({ state: state as ResourceStatus });
      const badge = container.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.getAttribute('label')).toBe(label);
      expect(badge.getAttribute('color')).toBe(color);
    },
  );
});
