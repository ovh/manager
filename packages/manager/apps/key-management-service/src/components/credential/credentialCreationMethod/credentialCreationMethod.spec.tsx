import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import CredentialCreationMethod from './credentialCreationMethod.component';

describe('CredentialStatus component test suite', () => {
  const useCases: {
    fromCSR: boolean;
    expectedLabel: string;
    otherLabel: string;
  }[] = [
    {
      fromCSR: true,
      expectedLabel: 'key_management_service_credential_created_with_csr',
      otherLabel: 'key_management_service_credential_created_without_csr',
    },
    {
      fromCSR: false,
      expectedLabel: 'key_management_service_credential_created_without_csr',
      otherLabel: 'key_management_service_credential_created_with_csr',
    },
  ];

  test.each(useCases)(
    'should return the right translation text for `fromCSR===$fromCSR`',
    ({ fromCSR, expectedLabel, otherLabel }) => {
      // given fromCSR

      // when
      const { getByText, queryByText } = render(
        <CredentialCreationMethod fromCSR={fromCSR} />,
      );

      // then
      expect(getByText(expectedLabel)).toBeInTheDocument();
      expect(queryByText(otherLabel)).not.toBeInTheDocument();
    },
  );
});
