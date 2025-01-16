import { ResourceStatus } from '@ovh-ux/manager-module-common-api';
import React from 'react';
import { vitest } from 'vitest';
import { render } from '../../utils/test.provider';
import {
  mapResourceStatusToState,
  ServiceStateBadge,
  STATES,
} from './ServiceStateBadge';

vitest.mock('../../hooks/iam');

const renderComponent = (
  props: React.ComponentProps<typeof ServiceStateBadge>,
) => {
  return render(<ServiceStateBadge {...props} data-testid="badge" />);
};

describe('should display manager state with the good color', () => {
  it.each([
    { state: 'active', label: 'service_state_active', color: 'success' },
    { state: 'deleted', label: 'service_state_deleted', color: 'critical' },
    { state: 'unknown', label: 'unknown', color: 'information' },
  ])(
    `should display manager $state badge for $color`,
    ({ state, label, color }) => {
      const container = renderComponent({ state: state as ResourceStatus });
      const badge = container.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.getAttribute('label')).toBe(label);
      expect(badge.getAttribute('color')).toBe(color);
    },
  );
});

describe('mapResourceStatusToState function', () => {
  it.each([
    { resourceStatus: 'active', expectedState: STATES.ACTIVE },
    { resourceStatus: 'deleted', expectedState: STATES.DELETED },
    { resourceStatus: 'suspended', expectedState: STATES.SUSPENDED },
    { resourceStatus: 'toActivate', expectedState: STATES.TO_ACTIVATE },
    { resourceStatus: 'toDelete', expectedState: STATES.TO_DELETE },
    { resourceStatus: 'toSuspend', expectedState: STATES.TO_SUSPEND },
  ])(
    'should map resource status $resourceStatus to state $expectedState.label',
    ({ resourceStatus, expectedState }) => {
      const mappedState = mapResourceStatusToState(
        resourceStatus as ResourceStatus,
      );
      expect(mappedState).toEqual(expectedState);
    },
  );
});
