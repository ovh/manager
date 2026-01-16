import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { BadgeColor } from '@ovhcloud/ods-react';

import { ResourceStatus } from '@ovh-ux/manager-react-components';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { assertBadgeColor } from '@/common/utils/tests/uiTestHelpers';

import { OkmsServiceState } from './OkmsServiceStateBadge.component';

const OKMS_SERVICE_STATE_BADGE_TEST_ID = 'okms-service-state-badge';

const renderOkmsServiceState = async (state: ResourceStatus) => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<OkmsServiceState state={state} data-testid={OKMS_SERVICE_STATE_BADGE_TEST_ID} />, {
    wrapper,
  });
};

describe('OkmsServiceState component test suite', () => {
  const useCases: {
    state: ResourceStatus;
    label: string;
    color: BadgeColor;
  }[] = [
    {
      state: 'active',
      label: labels.dashboard.key_management_service_dashboard_dashboard_field_state_active,
      color: 'success',
    },
    {
      state: 'deleted',
      label: labels.dashboard.key_management_service_dashboard_dashboard_field_state_deleted,
      color: 'critical',
    },
    {
      state: 'suspended',
      label: labels.dashboard.key_management_service_dashboard_dashboard_field_state_suspended,
      color: 'warning',
    },
    {
      state: 'toActivate',
      label: labels.dashboard.key_management_service_dashboard_dashboard_field_state_toActivate,
      color: 'information',
    },
    {
      state: 'toDelete',
      label: labels.dashboard.key_management_service_dashboard_dashboard_field_state_toDelete,
      color: 'neutral',
    },
    {
      state: 'toSuspend',
      label: labels.dashboard.key_management_service_dashboard_dashboard_field_state_toSuspend,
      color: 'neutral',
    },
  ];

  test.each(useCases)(
    'should return the right <Badge /> configuration for $state state',
    async ({ state, color: colorValue, label }) => {
      // when
      await renderOkmsServiceState(state);
      const component = screen.getByTestId(OKMS_SERVICE_STATE_BADGE_TEST_ID);

      // then
      expect(component).toBeInTheDocument();
      expect(component).toHaveTextContent(label);
      assertBadgeColor(component, colorValue);
    },
  );
});
