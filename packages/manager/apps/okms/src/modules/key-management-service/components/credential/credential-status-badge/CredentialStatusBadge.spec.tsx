import { OkmsCredentialStatus } from '@key-management-service/types/okmsCredential.type';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { BadgeColor } from '@ovhcloud/ods-react';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { assertBadgeColor } from '@/common/utils/tests/uiTestHelpers';

import { CredentialStatus } from './CredentialStatusBadge.component';

const CREDENTIAL_STATUS_TEST_ID = 'credential-status';

const renderCredentialStatus = async (state: OkmsCredentialStatus) => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<CredentialStatus state={state} data-testid={CREDENTIAL_STATUS_TEST_ID} />, {
    wrapper,
  });
};

describe('CredentialStatus component test suite', () => {
  const useCases: {
    state: OkmsCredentialStatus;
    label: string;
    color: BadgeColor;
  }[] = [
    {
      state: OkmsCredentialStatus.creating,
      label: labels.credentials['key_management_service_credential_status_creating'],
      color: 'information',
    },
    {
      state: OkmsCredentialStatus.deleting,
      label: labels.credentials['key_management_service_credential_status_deleting'],
      color: 'warning',
    },
    {
      state: OkmsCredentialStatus.error,
      label: labels.credentials['key_management_service_credential_status_error'],
      color: 'critical',
    },
    {
      state: OkmsCredentialStatus.expired,
      label: labels.credentials['key_management_service_credential_status_expired'],
      color: 'neutral',
    },
    {
      state: OkmsCredentialStatus.ready,
      label: labels.credentials['key_management_service_credential_status_ready'],
      color: 'success',
    },
  ];

  test.each(useCases)(
    'should return the right <Badge /> configuration for $state state',
    async ({ state, color, label }) => {
      // given state, color and label

      // when
      await renderCredentialStatus(state);
      const component = screen.getByTestId(CREDENTIAL_STATUS_TEST_ID);

      // then
      expect(component).toBeInTheDocument();
      expect(component).toHaveTextContent(label);
      assertBadgeColor(component, color);
    },
  );

  test('should return default <Badge /> configuration for unexpected state', async () => {
    // given
    const credentialState = 'AAA' as OkmsCredentialStatus;

    // when
    await renderCredentialStatus(credentialState);
    const component = screen.getByTestId(CREDENTIAL_STATUS_TEST_ID);

    // then
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent(credentialState);
  });
});
