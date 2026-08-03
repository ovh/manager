import { AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';

import { TApiCustomError } from '@ovh-ux/manager-core-api';

import { getVaultOrderErrorMessage, isVaultNameRejection } from './vaultOrderError';

const failure = (status?: number, message?: string): TApiCustomError =>
  ({
    response: status
      ? ({
          status,
          data: message === undefined ? {} : { class: 'Client::BadRequest', message },
        } as AxiosResponse)
      : undefined,
  }) as TApiCustomError;

describe('isVaultNameRejection', () => {
  it('reads a 400 or a 409 that names a reason as a verdict on the name', () => {
    expect(isVaultNameRejection(failure(400, 'Invalid vault name'))).toBe(true);
    expect(isVaultNameRejection(failure(409, 'This vault name is already taken'))).toBe(true);
  });

  it('leaves a server-side failure with the channel, whatever it says', () => {
    expect(isVaultNameRejection(failure(500, 'Internal server error'))).toBe(false);
    expect(isVaultNameRejection(failure(503, 'Service unavailable'))).toBe(false);
  });

  it('leaves the other 4xx with the channel: none of them is a verdict on a field', () => {
    // A missing order permission (R10) answers 403 with a message. Read as a name rejection, the modal
    // would blame a name that is perfectly valid and hide the only reason the customer can act on.
    expect(
      isVaultNameRejection(failure(403, 'You are not authorized to perform this action')),
    ).toBe(false);
    expect(isVaultNameRejection(failure(401, 'This session has expired'))).toBe(false);
    expect(isVaultNameRejection(failure(404, 'This service does not exist'))).toBe(false);
    expect(isVaultNameRejection(failure(429, 'Too many requests'))).toBe(false);
  });

  it('leaves a transport failure with the channel: no answer means no verdict on any field', () => {
    expect(isVaultNameRejection(failure())).toBe(false);
    expect(isVaultNameRejection(undefined)).toBe(false);
  });

  it('needs the reason itself, since an empty 400 gives the customer nothing to change', () => {
    expect(isVaultNameRejection(failure(400))).toBe(false);
    expect(isVaultNameRejection(failure(400, ''))).toBe(false);
  });
});

describe('getVaultOrderErrorMessage', () => {
  it('hands back the reason the API gave', () => {
    expect(getVaultOrderErrorMessage(failure(409, 'Already taken'))).toBe('Already taken');
  });

  it('is undefined when there is none, so the caller falls back to its own wording', () => {
    expect(getVaultOrderErrorMessage(failure(500, ''))).toBeUndefined();
    expect(getVaultOrderErrorMessage(failure())).toBeUndefined();
    expect(getVaultOrderErrorMessage(null)).toBeUndefined();
  });
});
