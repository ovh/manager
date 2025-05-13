import { AIError } from '@/data/api';

export const apiErrorMock = new AIError(
  'test',
  'test error',
  new XMLHttpRequest(),
  { message: 'api error message' },
  500,
  'statusText',
);
