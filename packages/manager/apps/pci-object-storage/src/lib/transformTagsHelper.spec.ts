import { describe, it, expect } from 'vitest';
import {
  transformTagsToApi,
  transformTagsFromApi,
} from './transformTagsHelper';
import { TagMap } from '../types/Tag';

describe('transformTagsToApi', () => {
  it('should return an empty object if tags is undefined', () => {
    expect(transformTagsToApi(undefined)).toEqual({});
  });

  it('should return an empty object if tags is empty', () => {
    expect(transformTagsToApi({})).toEqual({});
  });

  it('should transform TagMap to API format', () => {
    const tags: TagMap = {
      1: { key: 'env', value: 'prod' },
      2: { key: 'team', value: 'dev' },
    };
    expect(transformTagsToApi(tags)).toEqual({ env: 'prod', team: 'dev' });
  });

  it('should ignore tags with empty key', () => {
    const tags: TagMap = {
      1: { key: '', value: 'shouldBeIgnored' },
      2: { key: 'team', value: 'dev' },
    };
    expect(transformTagsToApi(tags)).toEqual({ team: 'dev' });
  });
});

describe('transformTagsFromApi', () => {
  it('should return an empty object if tags is undefined', () => {
    expect(transformTagsFromApi(undefined)).toEqual({});
  });

  it('should return an empty object if tags is empty', () => {
    expect(transformTagsFromApi({})).toEqual({});
  });

  it('should transform API format to TagMap', () => {
    const apiTags = { env: 'prod', team: 'dev' };
    expect(transformTagsFromApi(apiTags)).toEqual({
      1: { key: 'env', value: 'prod' },
      2: { key: 'team', value: 'dev' },
    });
  });
});
