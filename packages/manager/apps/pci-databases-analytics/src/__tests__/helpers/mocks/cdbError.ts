import { CdbError } from '@/api/databases';

export const apiErrorMock = new CdbError(
  'test',
  'test error',
  new XMLHttpRequest(),
  { message: 'api error message' },
  500,
  'statusText',
);
