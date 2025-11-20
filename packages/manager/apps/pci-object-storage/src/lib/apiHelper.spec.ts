import { describe, it, expect } from 'vitest';
import { getObjectStoreApiErrorMessage } from './apiHelper';
import { ObjStoError } from '@/data/api';

function createMockError(detailsMsg?: string, msg?: string): ObjStoError {
  return new ObjStoError(
    'ERR_CODE',
    'Error message',
    {} as XMLHttpRequest,
    {
      class: 'errorClass',
      message: msg ?? '',
      details: { message: detailsMsg ?? '' },
    },
    400,
    'Bad Request',
  );
}

describe('getObjectStoreApiErrorMessage', () => {
  it('should return details.message if present', () => {
    const err = createMockError('details error', 'main error');
    expect(getObjectStoreApiErrorMessage(err)).toBe('details error');
  });

  it('should return message if details.message is missing', () => {
    const err = createMockError(undefined, 'main error');
    expect(getObjectStoreApiErrorMessage(err)).toBe('main error');
  });

  it('should return "unknown error" if no message is present', () => {
    const err = createMockError(undefined, undefined);
    expect(getObjectStoreApiErrorMessage(err)).toBe('unknown error');
  });
});
