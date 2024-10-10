import { OkmsCredentialStatus } from '@/types/okmsCredential.type';
import { isDownloadCredentialDisabled } from './credentialDownload';

describe('isDownloadCertificateDisabled test suite', () => {
  const useCases: { state: OkmsCredentialStatus; isDisabled: boolean }[] = [
    {
      state: OkmsCredentialStatus.creating,
      isDisabled: true,
    },
    {
      state: OkmsCredentialStatus.deleting,
      isDisabled: true,
    },
    {
      state: OkmsCredentialStatus.error,
      isDisabled: false,
    },
    {
      state: OkmsCredentialStatus.expired,
      isDisabled: false,
    },
    {
      state: OkmsCredentialStatus.ready,
      isDisabled: false,
    },
  ];

  test.each(useCases)(
    'sould return $isDisabled for $state',
    ({ state, isDisabled }) => {
      // given state

      // when
      const result = isDownloadCredentialDisabled(state);

      // then
      expect(result).toBe(isDisabled);
    },
  );
});
