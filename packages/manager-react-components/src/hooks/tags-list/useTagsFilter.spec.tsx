import { describe, it, expect } from 'vitest';
import { useTagsFilter } from './useTagsFilter';

describe('useTagsFilter', () => {
  const tags = {
    environment: 'dev',
    environment1: 'prod',
    ovh: 'internal',
  };

  it('should return all tags when displayInternalTags is true', () => {
    const result = useTagsFilter({ tags, displayInternalTags: true });
    expect(result).toEqual([
      'environment:dev',
      'environment1:prod',
      'ovh:internal',
    ]);
  });

  it('should filter out internal tags when displayInternalTags is false', () => {
    const result = useTagsFilter({ tags, displayInternalTags: false });
    expect(result).toEqual(['environment:dev', 'environment1:prod']);
  });

  it('should return an empty array if tags is empty', () => {
    const result = useTagsFilter({ tags: {}, displayInternalTags: true });
    expect(result).toEqual([]);
  });
});
