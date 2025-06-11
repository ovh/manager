import { describe, it, expect } from 'vitest';
import { buildSearchQuery } from './buildSearchQuery';

describe('buildSearchQuery test suite', () => {
  const serviceName = 'testService';
  const taskId = 'testTask';
  const page = 42;
  const debug = false;

  it('returns the search query with params passed', () => {
    expect(buildSearchQuery({ serviceName })).toEqual(
      `?serviceName=${serviceName}`,
    );
    expect(buildSearchQuery({ serviceName, taskId, page, debug })).toEqual(
      `?serviceName=${serviceName}&taskId=${taskId}&page=${page}&debug=${debug}`,
    );
  });

  it('returns the search query without null, undefined or empty string params passed', () => {
    expect(
      buildSearchQuery({
        serviceName,
        taskId: '',
        page: null,
        debug: undefined,
      }),
    ).toEqual(`?serviceName=${serviceName}`);
  });

  it('returns an empty string if all params are undefined or null', () => {
    expect(
      buildSearchQuery({ serviceName: '', taskId: undefined, page: null }),
    ).toEqual('');
  });
});
