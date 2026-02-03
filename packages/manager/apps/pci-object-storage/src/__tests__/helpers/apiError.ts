import { ObjStoError } from '@/data/api';

export const mockedObjStoError = new ObjStoError(
  'ERR_API_ERROR',
  'An error occurred',
  {} as XMLHttpRequest,
  {
    class: 'Client::BadRequest',
    message: 'Invalid request parameters',
    details: {
      message: 'The provided data is invalid',
    },
  },
  400,
  'Bad Request',
);
