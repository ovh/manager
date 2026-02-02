import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';

import { isOkmsActive } from './isOkmsActive';

type TestCases = {
  okms: OKMS | undefined;
  expectedResult: boolean;
};

const test_cases: TestCases[] = [
  {
    okms: undefined,
    expectedResult: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'EXPIRED' } },
    expectedResult: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'IN_CREATION' } },
    expectedResult: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'SUSPENDED' } },
    expectedResult: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'OK' } },
    expectedResult: true,
  },
];

describe('isOkmsActive test suite', () => {
  it.each(test_cases)(
    'should return $expectedResult for okms state $okms.iam.state',
    ({ okms, expectedResult }) => {
      // GIVEN okms

      // WHEN
      const result = isOkmsActive(okms);

      // THEN
      expect(result).toBe(expectedResult);
    },
  );
});
