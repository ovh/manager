import { describe, expect, it } from 'vitest';

import { isAccountWriteRequest } from './account.constants';

describe('isAccountWriteRequest', () => {
  it('lets reads through', () => {
    expect(isAccountWriteRequest({ method: 'GET', url: '/me' })).toBe(false);
    expect(isAccountWriteRequest({ url: '/me' })).toBe(false);
  });

  it('blocks every write', () => {
    ['POST', 'put', 'DELETE', 'PATCH'].forEach((method) =>
      expect(isAccountWriteRequest({ method, url: '/me/contact' })).toBe(true),
    );
  });

  it('lets read-only POSTs through', () => {
    expect(
      isAccountWriteRequest({ method: 'POST', url: '/newAccount/rules' }),
    ).toBe(false);
    expect(
      isAccountWriteRequest({
        method: 'POST',
        url:
          '/engine/api/v2/iam/resource/urn%3Av1%3Aeu%3Aaccount/authorization/check',
      }),
    ).toBe(false);
  });
});
