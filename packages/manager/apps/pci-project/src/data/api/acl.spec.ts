/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getProjectAcl,
  getProjectAclAccountInfo,
  addAccountAclToProject,
  deleteAccountAclFromProject,
  AccountAcl,
} from './acl';

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-core-api') = await importOriginal();
  return {
    ...actual,
    v6: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const mockGet = vi.mocked(v6.get);
const mockPost = vi.mocked(v6.post);
const mockDelete = vi.mocked(v6.delete);

describe('acl api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProjectAcl calls correct endpoint and returns data', async () => {
    mockGet.mockResolvedValueOnce({ data: ['u1', 'u2'] } as any);
    const result = await getProjectAcl('p-1');
    expect(mockGet).toHaveBeenCalledWith('/cloud/project/p-1/acl');
    expect(result).toEqual(['u1', 'u2']);
  });

  it('getProjectAclAccountInfo calls correct endpoint and returns data', async () => {
    const apiResult = { accountId: 'u1', type: 'readOnly' } as AccountAcl;
    mockGet.mockResolvedValueOnce({ data: apiResult } as any);
    const result = await getProjectAclAccountInfo('p-1', 'u1');
    expect(mockGet).toHaveBeenCalledWith('/cloud/project/p-1/acl/u1');
    expect(result).toEqual(apiResult);
  });

  it('addAccountAclToProject posts with correct URL and body and returns data', async () => {
    const account: AccountAcl = { accountId: 'u3', type: 'readWrite' } as any;
    mockPost.mockResolvedValueOnce({ data: account } as any);
    const result = await addAccountAclToProject('p-1', account);
    expect(mockPost).toHaveBeenCalledWith(
      '/cloud/project/p-1/acl?accountId=u3',
      account,
    );
    expect(result).toEqual(account);
  });

  it('deleteAccountAclFromProject calls correct URL and returns accountId', async () => {
    mockDelete.mockResolvedValueOnce({} as any);
    const result = await deleteAccountAclFromProject('p-1', 'u4');
    expect(mockDelete).toHaveBeenCalledWith('/cloud/project/p-1/acl/u4');
    expect(result).toBe('u4');
  });
});
