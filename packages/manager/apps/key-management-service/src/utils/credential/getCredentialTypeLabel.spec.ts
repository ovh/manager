import { CertificateType, OkmsCredential } from '@/types/okmsCredential.type';
import { getCredentialTypeLabel } from './getCredentialTypeLabel';
import { credentialMock } from '@/mocks/credentials/credentials.mock';

describe('getCredentialTypeLabel test suite', () => {
  type TestCase = {
    type: CertificateType;
    label: string;
  };

  const testCases: TestCase[] = [
    { type: 'RSA', label: 'RSA' },
    { type: 'EC', label: 'ECDSA' },
  ];

  it.each(testCases)(
    'should return $label for credential type $type',
    ({ type, label }) => {
      const credential: OkmsCredential = {
        ...credentialMock[0],
        certificateType: type,
      };
      const result = getCredentialTypeLabel(credential);

      expect(result).toBe(label);
    },
  );
});
