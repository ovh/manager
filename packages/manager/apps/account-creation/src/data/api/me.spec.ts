import { beforeEach, describe, expect, it, vi } from 'vitest';

const { put } = vi.hoisted(() => ({ put: vi.fn() }));

vi.mock('axios', () => ({
  default: { create: () => ({ put, get: vi.fn() }) },
}));

vi.mock('@ovh-ux/request-tagger', () => ({ getHeaders: () => ({}) }));

// eslint-disable-next-line import/first
import { putMe } from './me';

// Account creation saves the account details with PUT /me through its own
// axios instance: the read-only mode of the legacy account section (an
// AngularJS $http interceptor) must not prevent it.
describe('putMe', () => {
  beforeEach(() => put.mockReset());

  it.each([
    ['individual', { legalform: 'individual', firstname: 'Jane', name: 'Doe' }],
    [
      'corporation',
      {
        legalform: 'corporation',
        organisation: 'ACME',
        companyNationalIdentificationNumber: '42476141900045',
      },
    ],
    [
      'association',
      {
        legalform: 'association',
        organisation: 'Les Amis du Code',
        companyNationalIdentificationNumber: '84298477700017',
      },
    ],
  ])('sends the %s account to PUT /me', async (_, account) => {
    put.mockResolvedValue({ data: account });

    await expect(putMe(account as never)).resolves.toEqual(account);
    expect(put).toHaveBeenCalledWith('/me', account);
  });
});
