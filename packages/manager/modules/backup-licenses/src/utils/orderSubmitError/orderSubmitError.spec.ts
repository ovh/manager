import { describe, expect, it } from 'vitest';

import { TApiCustomError } from '@ovh-ux/manager-core-api';

import { getOrderSubmitErrorMessage } from './orderSubmitError';

const FALLBACK = 'generic';

const anError = (status: number, message?: string) =>
  ({ response: { status, data: message ? { message } : {} } }) as TApiCustomError;

describe('getOrderSubmitErrorMessage', () => {
  it('repeats what the API refused when the refusal is named and actionable', () => {
    expect(getOrderSubmitErrorMessage(anError(400, 'Offer not available'), FALLBACK)).toBe(
      'Offer not available',
    );
  });

  it('keeps the generic wording for a server failure, which tells the customer nothing', () => {
    expect(getOrderSubmitErrorMessage(anError(500, 'Internal server error'), FALLBACK)).toBe(
      FALLBACK,
    );
  });

  it('keeps the generic wording when the API said nothing at all', () => {
    expect(getOrderSubmitErrorMessage(anError(409), FALLBACK)).toBe(FALLBACK);
    expect(getOrderSubmitErrorMessage(null, FALLBACK)).toBe(FALLBACK);
  });
});
