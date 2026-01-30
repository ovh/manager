import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import CredentialCreationMethod from './credentialCreationMethod.component';

describe('CredentialStatus component test suite', () => {
  const useCases: {
    fromCSR: boolean;
    expectedLabel: string;
    otherLabel: string;
  }[] = [
    {
      fromCSR: true,
      expectedLabel: labels.credentials.key_management_service_credential_created_with_csr,
      otherLabel: labels.credentials.key_management_service_credential_created_without_csr,
    },
    {
      fromCSR: false,
      expectedLabel: labels.credentials.key_management_service_credential_created_without_csr,
      otherLabel: labels.credentials.key_management_service_credential_created_with_csr,
    },
  ];

  test.each(useCases)(
    'should return the right translation text for `fromCSR===$fromCSR`',
    async ({ fromCSR, expectedLabel, otherLabel }) => {
      // given fromCSR
      const wrapper = await testWrapperBuilder().withI18next().build();

      // when
      const { getByText, queryByText } = render(<CredentialCreationMethod fromCSR={fromCSR} />, {
        wrapper,
      });

      // then
      expect(getByText(expectedLabel)).toBeInTheDocument();
      expect(queryByText(otherLabel)).not.toBeInTheDocument();
    },
  );
});
