import { describe, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getAllSshKeys,
  getSshKey,
  removeSshKey,
  addSshKey,
  paginateResults,
  filterSshKeys,
} from '@/data/ssh';
import { SshKey } from '@/interface';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: {} });
  });
  const deleteFn = vi.fn(() => {
    return Promise.resolve({ data: {} });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: {} });
  });
  return {
    v6: {
      get,
      delete: deleteFn,
      post,
    },
  };
});

describe('ssh keys data', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should list all ssh keys', async () => {
    expect(v6.get).not.toHaveBeenCalled();
    const projectId = '12345';
    getAllSshKeys(projectId);
    expect(v6.get).toHaveBeenCalledWith(`/cloud/project/${projectId}/sshkey`);
  });
  it('should get a single ssh key', async () => {
    expect(v6.get).not.toHaveBeenCalled();
    const projectId = '123';
    const sshKeyId = 'abc';
    getSshKey(projectId, sshKeyId);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/sshkey/${sshKeyId}`,
    );
  });
  it('should remove a single ssh key', async () => {
    expect(v6.delete).not.toHaveBeenCalled();
    const projectId = 'hello';
    const sshKeyId = 'world';
    removeSshKey(projectId, sshKeyId);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/sshkey/${sshKeyId}`,
    );
  });
  it('should add a single ssh key', async () => {
    expect(v6.delete).not.toHaveBeenCalled();
    const projectId = 'foo';
    const key = {
      name: 'foo',
      publicKey: 'bar',
    };
    addSshKey(projectId, key);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/sshkey`,
      key,
    );
  });
  it('should paginate ssh keys', () => {
    const sshKeys: SshKey[] = [];
    for (let i = 0; i < 50; i += 1)
      sshKeys.push({
        name: `ssh-key-name-${i}`,
        publicKey: `ssh-key-publicKey-${i}`,
      });
    let pagination = paginateResults(sshKeys, {
      pageIndex: 3,
      pageSize: 10,
    });
    expect(pagination.rows[0].name).toBe('ssh-key-name-30');
    expect(pagination.pageCount).toBe(5);
    expect(pagination.totalRows).toBe(sshKeys.length);
    pagination = paginateResults(sshKeys, {
      pageIndex: 7,
      pageSize: 17,
    });
    expect(pagination.rows.length).toBe(0);
    expect(pagination.pageCount).toBe(3);
    expect(pagination.totalRows).toBe(sshKeys.length);
    pagination = paginateResults(sshKeys, {
      pageIndex: 2,
      pageSize: 17,
    });
    expect(pagination.rows[0].name).toBe('ssh-key-name-34');
    expect(pagination.pageCount).toBe(3);
    expect(pagination.totalRows).toBe(sshKeys.length);
    pagination = paginateResults(sshKeys, {
      pageIndex: 0,
      pageSize: 17,
    });
    expect(pagination.rows.length).toBe(17);
    expect(pagination.rows[0].name).toBe('ssh-key-name-0');
    expect(pagination.rows[16].name).toBe('ssh-key-name-16');
    expect(pagination.pageCount).toBe(3);
    expect(pagination.totalRows).toBe(sshKeys.length);
  });
  it('should filter ssh keys', () => {
    const foo = { name: 'foo', publicKey: 'foo' };
    const bar = { name: 'bar', publicKey: 'bar' };
    const baz = { name: 'baz', publicKey: 'baz' };
    expect(filterSshKeys([foo, bar, baz], [], ['foo'])).toEqual([foo]);
    expect(filterSshKeys([foo, bar, baz], [], ['ba'])).toEqual([bar, baz]);
    expect(filterSshKeys([foo, bar, baz], [], ['bar'])).toEqual([bar]);
    expect(filterSshKeys([foo, bar, baz], [], ['bar', 'foo'])).toEqual([]);
  });
});
