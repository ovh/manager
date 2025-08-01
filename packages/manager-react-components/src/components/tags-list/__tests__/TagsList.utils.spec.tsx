import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getVisibleTagCount, filterTags } from '../TagsList.utils';
import { HTMLBadgeElement } from '../TagsList.type';

// mock canvas element context for determining the width of the Badge
const mockConvasElementContext = {
  measureText: vi.fn().mockReturnValue({ width: 60 }),
  font: '',
};
global.HTMLCanvasElement.prototype.getContext = vi
  .fn()
  .mockReturnValue(mockConvasElementContext);

// mock window.getComputedStyle that determing sample badge's styles
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    marginRight: '10px',
    marginLeft: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: '12px',
    fontFamily: 'Arial',
  }),
  writable: true,
});

// Assume the sample badge's width as 60px
const mockBadge = {
  offsetWidth: 60,
} as HTMLBadgeElement;

// Assuming every badge will be 60px and padding-y to be 20px and margin-y to be 20px.
// Space required for each badge display is 100px
describe('getVisibleTagCount', () => {
  const mockTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 0 when no tags are provided', () => {
    const mockContainer = {
      offsetWidth: 500,
    } as HTMLDivElement;

    const result = getVisibleTagCount([], mockBadge, mockContainer, 2);
    expect(result).toBe(0);
  });

  it('should fit all tags when there is enough space in one line', () => {
    const mockContainer = {
      offsetWidth: 1000, // Large enough for all tags
    } as HTMLDivElement;

    const result = getVisibleTagCount(mockTags, mockBadge, mockContainer, 1);
    expect(result).toBe(4); // tag1 is already displayed, so 4 more can fit
  });

  it('should respect maxLines limit and break to next line when needed', () => {
    const mockContainer = {
      offsetWidth: 100, // Limited space
    } as HTMLDivElement;

    const result = getVisibleTagCount(mockTags, mockBadge, mockContainer, 3);
    expect(result).toBe(2);
  });

  it('should break to next line when a tag is too wide for current line', () => {
    const mockContainer = {
      offsetWidth: 90, // Very limited space
    } as HTMLDivElement;

    const result = getVisibleTagCount(mockTags, mockBadge, mockContainer, 3);
    expect(result).toBe(2);
  });

  it('should account for MORE_TAGS_ICON_WIDTH on the last line', () => {
    const mockContainer = {
      offsetWidth: 200,
    } as HTMLDivElement;

    // each line can accomodate 2 badges, so without icon space, the function is expected to return 3.
    // Since icon has to be displayed, there is not enough space for 3rd badge to be displayed
    const result = getVisibleTagCount(mockTags, mockBadge, mockContainer, 2);
    expect(result).toBe(2);
  });

  it('should handle single line constraint', () => {
    const mockContainer = {
      offsetWidth: 180,
    } as HTMLDivElement;

    const result = getVisibleTagCount(mockTags, mockBadge, mockContainer, 1);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 when container width is smaller than first badge', () => {
    const mockContainer = {
      offsetWidth: 50, // Smaller than badge
    } as HTMLDivElement;

    const result = getVisibleTagCount(mockTags, mockBadge, mockContainer, 1);
    expect(result).toBe(0);
  });
});

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
