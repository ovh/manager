import React from 'react';
import {
  ODS_TEXT_COLOR_INTENT,
  OdsChipAttribute,
} from '@ovhcloud/ods-components';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { OkmsCredentialStatus } from '@/types/okmsCredential.type';
import { CredentialStatus } from './CredentialStatus.component';

describe('CredentialStatus component test suite', () => {
  const useCases: {
    state: OkmsCredentialStatus;
    label: string;
    colorValue: OdsChipAttribute['color'];
  }[] = [
    {
      state: OkmsCredentialStatus.creating,
      label: 'key_management_service_credential_status_creating',
      colorValue: ODS_TEXT_COLOR_INTENT.primary,
    },
    {
      state: OkmsCredentialStatus.deleting,
      label: 'key_management_service_credential_status_deleting',
      colorValue: ODS_TEXT_COLOR_INTENT.warning,
    },
    {
      state: OkmsCredentialStatus.error,
      label: 'key_management_service_credential_status_error',
      colorValue: ODS_TEXT_COLOR_INTENT.error,
    },
    {
      state: OkmsCredentialStatus.expired,
      label: 'key_management_service_credential_status_expired',
      colorValue: ODS_TEXT_COLOR_INTENT.default,
    },
    {
      state: OkmsCredentialStatus.ready,
      label: 'key_management_service_credential_status_ready',
      colorValue: ODS_TEXT_COLOR_INTENT.success,
    },
  ];

  test.each(useCases)(
    'should return the right <OsdsChip /> configuration for $state state',
    ({ state, colorValue, label }) => {
      // given state, colorValue and label

      // when
      const { getByTestId } = render(
        <CredentialStatus state={state} data-testid="test" />,
      );
      const component = getByTestId('test');

      // then
      expect(component).toHaveTextContent(label);
      expect(component).toHaveProperty('color', colorValue);
    },
  );

  it('should return default <OsdsChip /> configuration for unexpected state', () => {
    // given
    const serviceKeyState = 'AAA' as OkmsCredentialStatus;

    // when
    const { getByTestId } = render(
      <CredentialStatus state={serviceKeyState} data-testid="test" />,
    );
    const component = getByTestId('test');

    // then
    expect(component).toHaveTextContent(serviceKeyState);
    expect(component).toHaveProperty('color', ODS_TEXT_COLOR_INTENT.default);
  });
});
