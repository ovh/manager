import React from 'react';
import {
  ODS_TEXT_COLOR_INTENT,
  OdsChipAttribute,
} from '@ovhcloud/ods-components';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ServiceKeyStatus } from './serviceKeyStatus.component';
import { OkmsServiceKeyState } from '@/types/okmsServiceKey.type';

describe('ServiceKeyStatus component test suite', () => {
  const useCases: {
    state: OkmsServiceKeyState;
    label: string;
    colorValue: OdsChipAttribute['color'];
  }[] = [
    {
      state: OkmsServiceKeyState.active,
      label: 'key_management_service_service-keys_dashboard_field_state_active',
      colorValue: ODS_TEXT_COLOR_INTENT.success,
    },
    {
      state: OkmsServiceKeyState.compromised,
      label:
        'key_management_service_service-keys_dashboard_field_state_compromised',
      colorValue: ODS_TEXT_COLOR_INTENT.warning,
    },
    {
      state: OkmsServiceKeyState.deactivated,
      label:
        'key_management_service_service-keys_dashboard_field_state_deactivated',
      colorValue: ODS_TEXT_COLOR_INTENT.warning,
    },
    {
      state: OkmsServiceKeyState.destroyed,
      label:
        'key_management_service_service-keys_dashboard_field_state_destroyed',
      colorValue: ODS_TEXT_COLOR_INTENT.error,
    },
    {
      state: OkmsServiceKeyState.destroyed_compromised,
      label:
        'key_management_service_service-keys_dashboard_field_state_destroyed_compromised',
      colorValue: ODS_TEXT_COLOR_INTENT.error,
    },
    {
      state: OkmsServiceKeyState.pre_active,
      label:
        'key_management_service_service-keys_dashboard_field_state_pre_active',
      colorValue: ODS_TEXT_COLOR_INTENT.info,
    },
  ];

  test.each(useCases)(
    'should return the right <OsdsChip /> configuration for $state state',
    ({ state, colorValue, label }) => {
      // given state, colorValue and label

      // when
      const { getByTestId } = render(
        <ServiceKeyStatus state={state} data-testid="test" />,
      );
      const component = getByTestId('test');

      // then
      expect(component).toHaveTextContent(label);
      expect(component).toHaveProperty('color', colorValue);
    },
  );

  it('should return default <OsdsChip /> configuration for unexpected state', () => {
    // given
    const serviceKeyState = 'AAA';

    // when
    const { getByTestId } = render(
      <ServiceKeyStatus state={serviceKeyState} data-testid="test" />,
    );
    const component = getByTestId('test');

    // then
    expect(component).toHaveTextContent(serviceKeyState);
    expect(component).toHaveProperty('color', ODS_TEXT_COLOR_INTENT.default);
  });
});
