import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ServiceKeyStatus } from './serviceKeyStatus.component';
import { OkmsServiceKeyState } from '@/types/okmsServiceKey.type';

describe('ServiceKeyStatus component test suite', () => {
  const useCases: {
    state: OkmsServiceKeyState;
    label: string;
    colorValue: ODS_BADGE_COLOR;
  }[] = [
    {
      state: OkmsServiceKeyState.active,
      label: 'key_management_service_service-keys_dashboard_field_state_active',
      colorValue: ODS_BADGE_COLOR.success,
    },
    {
      state: OkmsServiceKeyState.compromised,
      label:
        'key_management_service_service-keys_dashboard_field_state_compromised',
      colorValue: ODS_BADGE_COLOR.warning,
    },
    {
      state: OkmsServiceKeyState.deactivated,
      label:
        'key_management_service_service-keys_dashboard_field_state_deactivated',
      colorValue: ODS_BADGE_COLOR.warning,
    },
    {
      state: OkmsServiceKeyState.destroyed,
      label:
        'key_management_service_service-keys_dashboard_field_state_destroyed',
      colorValue: ODS_BADGE_COLOR.critical,
    },
    {
      state: OkmsServiceKeyState.destroyed_compromised,
      label:
        'key_management_service_service-keys_dashboard_field_state_destroyed_compromised',
      colorValue: ODS_BADGE_COLOR.critical,
    },
    {
      state: OkmsServiceKeyState.pre_active,
      label:
        'key_management_service_service-keys_dashboard_field_state_pre_active',
      colorValue: ODS_BADGE_COLOR.information,
    },
  ];

  test.each(useCases)(
    'should return the right <OdsBadge /> configuration for $state state',
    ({ state, colorValue, label }) => {
      // given state, colorValue and label

      // when
      const { getByTestId } = render(
        <ServiceKeyStatus state={state} data-testid="test" />,
      );
      const component = getByTestId('test');

      // then
      expect(component).toHaveProperty('label', label);
      expect(component).toHaveProperty('color', colorValue);
    },
  );

  it('should return default <OdsBadge /> configuration for unexpected state', () => {
    // given
    const serviceKeyState = 'unknown' as OkmsServiceKeyState;

    // when
    const { getByTestId } = render(
      <ServiceKeyStatus state={serviceKeyState} data-testid="test" />,
    );
    const component = getByTestId('test');

    // then
    expect(component).toHaveProperty('label', serviceKeyState);
    expect(component).toHaveProperty('color', ODS_BADGE_COLOR.neutral);
  });
});
