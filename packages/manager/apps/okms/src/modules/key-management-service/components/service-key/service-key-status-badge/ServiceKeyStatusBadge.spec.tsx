import { OkmsServiceKeyState } from '@key-management-service/types/okmsServiceKey.type';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { BadgeColor } from '@ovhcloud/ods-react';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { assertBadgeColor } from '@/common/utils/tests/uiTestHelpers';

import { ServiceKeyStatus } from './ServiceKeyStatusBadge.component';

const SERVICE_KEY_STATUS_TEST_ID = 'service-key-status';

const renderServiceKeyStatus = async (state: OkmsServiceKeyState) => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<ServiceKeyStatus state={state} data-testid={SERVICE_KEY_STATUS_TEST_ID} />, {
    wrapper,
  });
};

describe('ServiceKeyStatus component test suite', () => {
  const useCases: {
    state: OkmsServiceKeyState;
    label: string;
    color: BadgeColor;
  }[] = [
    {
      state: OkmsServiceKeyState.active,
      label: labels.serviceKeys['key_management_service_service-keys_dashboard_field_state_active'],
      color: 'success',
    },
    {
      state: OkmsServiceKeyState.compromised,
      label:
        labels.serviceKeys['key_management_service_service-keys_dashboard_field_state_compromised'],
      color: 'warning',
    },
    {
      state: OkmsServiceKeyState.deactivated,
      label:
        labels.serviceKeys['key_management_service_service-keys_dashboard_field_state_deactivated'],
      color: 'warning',
    },
    {
      state: OkmsServiceKeyState.destroyed,
      label:
        labels.serviceKeys['key_management_service_service-keys_dashboard_field_state_destroyed'],
      color: 'critical',
    },
    {
      state: OkmsServiceKeyState.destroyed_compromised,
      label:
        labels.serviceKeys[
          'key_management_service_service-keys_dashboard_field_state_destroyed_compromised'
        ],
      color: 'critical',
    },
    {
      state: OkmsServiceKeyState.pre_active,
      label:
        labels.serviceKeys['key_management_service_service-keys_dashboard_field_state_pre_active'],
      color: 'information',
    },
  ];

  test.each(useCases)(
    'should return the right <Badge /> configuration for $state state',
    async ({ state, color, label }) => {
      // given state, color and label

      // when
      await renderServiceKeyStatus(state);
      const component = screen.getByTestId(SERVICE_KEY_STATUS_TEST_ID);

      // then
      expect(component).toBeInTheDocument();
      expect(component).toHaveTextContent(label);
      assertBadgeColor(component, color);
    },
  );

  test('should return default <Badge /> configuration for unexpected state', async () => {
    // given
    const serviceKeyState = 'unknown' as OkmsServiceKeyState;

    // when
    await renderServiceKeyStatus(serviceKeyState);
    const component = screen.getByTestId(SERVICE_KEY_STATUS_TEST_ID);

    // then
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent(serviceKeyState);
  });
});
