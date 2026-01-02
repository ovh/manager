import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';

import { canPerformActionsOnOkmsAndChildren } from './canPerformActionsOnOkmsAndChildren';

type TestCases = {
  okms: OKMS | undefined;
  result: boolean;
};

const test_cases: TestCases[] = [
  {
    okms: undefined,
    result: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'EXPIRED' } },
    result: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'IN_CREATION' } },
    result: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'SUSPENDED' } },
    result: false,
  },
  {
    okms: { ...okmsRoubaix1Mock, iam: { ...okmsRoubaix1Mock.iam, state: 'OK' } },
    result: true,
  },
];

describe('canPerformActionsOnOkmsAndChildren test suite', () => {
  it.each(test_cases)(
    'should return $result for okms state $okms.iam.state',
    ({ okms, result }) => {
      // GIVEN okms

      // WHEN
      const result2 = canPerformActionsOnOkmsAndChildren(okms);

      // THEN
      expect(result2).toBe(result);
    },
  );
});
