import React from 'react';
import {
  ODS_BADGE_COLOR,
  OdsBadge as OdsBadgeType,
} from '@ovhcloud/ods-components';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { OkmsCredentialStatus } from '@/types/okmsCredential.type';
import { CredentialStatus } from './CredentialStatus.component';

describe('CredentialStatus component test suite', () => {
  const useCases: {
    state: OkmsCredentialStatus;
    label: string;
    colorValue: OdsBadgeType['color'];
  }[] = [
    {
      state: OkmsCredentialStatus.creating,
      label: 'key_management_service_credential_status_creating',
      colorValue: ODS_BADGE_COLOR.information,
    },
    {
      state: OkmsCredentialStatus.deleting,
      label: 'key_management_service_credential_status_deleting',
      colorValue: ODS_BADGE_COLOR.warning,
    },
    {
      state: OkmsCredentialStatus.error,
      label: 'key_management_service_credential_status_error',
      colorValue: ODS_BADGE_COLOR.critical,
    },
    {
      state: OkmsCredentialStatus.expired,
      label: 'key_management_service_credential_status_expired',
      colorValue: ODS_BADGE_COLOR.neutral,
    },
    {
      state: OkmsCredentialStatus.ready,
      label: 'key_management_service_credential_status_ready',
      colorValue: ODS_BADGE_COLOR.success,
    },
  ];

  test.each(useCases)(
    'should return the right <OdsBadge /> configuration for $state state',
    ({ state, colorValue, label }) => {
      // given state, colorValue and label

      // when
      const { getByTestId } = render(
        <CredentialStatus state={state} data-testid="test" />,
      );
      const component = getByTestId('test');

      // then
      expect(component).toHaveProperty('label', label);
      expect(component).toHaveProperty('color', colorValue);
    },
  );

  it('should return default <OdsBadge /> configuration for unexpected state', () => {
    // given
    const serviceKeyState = 'AAA' as OkmsCredentialStatus;

    // when
    const { getByTestId } = render(
      <CredentialStatus state={serviceKeyState} data-testid="test" />,
    );
    const component = getByTestId('test');

    // then
    expect(component).toHaveProperty('label', serviceKeyState);
    expect(component).toHaveProperty('color', ODS_BADGE_COLOR.neutral);
  });
});
