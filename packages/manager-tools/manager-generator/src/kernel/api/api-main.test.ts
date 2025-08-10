import { beforeEach, describe, expect, it, vi } from 'vitest';

import { v2Prefix, v6Prefix } from '../../playbook/config/kernel-config';
import * as apiHelper from './api-helper';
import { getApiPaths } from './api-main';

vi.mock('./api-helper', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./api-helper')>();
  return {
    ...actual,
    fetchRootServicePaths: vi.fn(),
  };
});

const mockedFetch = apiHelper.fetchRootServicePaths as unknown as ReturnType<typeof vi.fn>;

describe('getApiPaths', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return choices grouped by v2 and v6', async () => {
    mockedFetch
      .mockResolvedValueOnce(['/iam', '/cloud']) // v2Paths
      .mockResolvedValueOnce(['/iam', '/cloud/project']); // v6Paths

    const result = await getApiPaths();

    expect(result).toEqual([
      { type: 'separator', line: '— API v2 —' },
      { name: '/iam', value: `${v2Prefix}/iam` },
      { name: '/cloud', value: `${v2Prefix}/cloud` },
      { type: 'separator', line: '— API v6 —' },
      { name: '/iam', value: `${v6Prefix}/iam` },
      { name: '/cloud/project', value: `${v6Prefix}/cloud/project` },
    ]);
  });

  it('should handle empty results', async () => {
    mockedFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const result = await getApiPaths();

    expect(result).toEqual([
      { type: 'separator', line: '— API v2 —' },
      { type: 'separator', line: '— API v6 —' },
    ]);
  });

  it('should normalize paths (leading slash)', async () => {
    mockedFetch
      .mockResolvedValueOnce(['iam', 'cloud']) // v2
      .mockResolvedValueOnce(['cloud/project']); // v6

    const result = await getApiPaths();

    expect(result).toEqual([
      { type: 'separator', line: '— API v2 —' },
      { name: '/iam', value: `${v2Prefix}/iam` },
      { name: '/cloud', value: `${v2Prefix}/cloud` },
      { type: 'separator', line: '— API v6 —' },
      { name: '/cloud/project', value: `${v6Prefix}/cloud/project` },
    ]);
  });
});
