import { describe, expect, it } from 'vitest';

import { buildSearchQuery } from '../buildSearchQuery.utils';

describe('buildSearchQuery test suite', () => {
  const id = 'testId';
  const taskId = 'testTask';
  const page = 42;
  const debug = false;

  it('returns the search query with params passed', () => {
    expect(buildSearchQuery({ id })).toEqual(`?id=${id}`);
    expect(buildSearchQuery({ id, taskId, page, debug })).toEqual(
      `?id=${id}&taskId=${taskId}&page=${page}&debug=${debug}`,
    );
  });

  it('returns the search query without undefined or empty string params passed', () => {
    expect(
      buildSearchQuery({
        id,
        taskId: '',
        debug: undefined,
      }),
    ).toEqual(`?id=${id}`);
  });

  it('returns an empty string if all params are empty or undefined', () => {
    expect(buildSearchQuery({ id: '', taskId: undefined })).toEqual('');
  });
});
