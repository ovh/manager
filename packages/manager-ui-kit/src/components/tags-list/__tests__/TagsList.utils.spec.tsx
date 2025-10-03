import { describe, it, expect } from 'vitest';
import { filterTags } from '../TagsList.utils';

describe('filterTags', () => {
  const mockTags = {
    env: 'production',
    version: '1.0.0',
    'ovh:internal': 'secret-value',
    'ovh:debug': 'debug-info',
    team: 'frontend',
    'ovh:temp': 'temporary-data',
  };

  it('should return empty array when tags object is empty', () => {
    const result = filterTags({ tags: {}, displayInternalTags: false });
    expect(result).toEqual([]);
  });

  it('should filter out internal tags (starting with ovh:) when displayInternalTags is false', () => {
    const result = filterTags({ tags: mockTags, displayInternalTags: false });
    expect(result).toEqual([
      'env:production',
      'version:1.0.0',
      'team:frontend',
    ]);
    expect(result).not.toContain('ovh:internal:secret-value');
    expect(result).not.toContain('ovh:debug:debug-info');
    expect(result).not.toContain('ovh:temp:temporary-data');
  });

  it('should include internal tags when displayInternalTags is true', () => {
    const result = filterTags({ tags: mockTags, displayInternalTags: true });
    expect(result).toEqual([
      'env:production',
      'version:1.0.0',
      'ovh:internal:secret-value',
      'ovh:debug:debug-info',
      'team:frontend',
      'ovh:temp:temporary-data',
    ]);
  });

  it('should return all tags when there are no internal tags and displayInternalTags is false', () => {
    const tagsWithoutInternal = {
      env: 'staging',
      version: '2.0.0',
      team: 'backend',
    };
    const result = filterTags({
      tags: tagsWithoutInternal,
      displayInternalTags: false,
    });

    expect(result).toEqual(['env:staging', 'version:2.0.0', 'team:backend']);
  });

  it('should return empty array when all tags are internal and displayInternalTags is false', () => {
    const onlyInternalTags = {
      'ovh:config': 'value1',
      'ovh:secret': 'value2',
      'ovh:data': 'value3',
    };
    const result = filterTags({
      tags: onlyInternalTags,
      displayInternalTags: false,
    });
    expect(result).toEqual([]);
  });

  it('should handle prototype pollution edge cases', () => {
    const pollutedTags = Object.create({
      'ovh:polluted': 'should-not-appear',
    });
    pollutedTags['normal-tag'] = 'normal-value';

    const result = filterTags({
      tags: pollutedTags,
      displayInternalTags: false,
    });

    expect(result).toEqual(['normal-tag:normal-value']);
  });
});
