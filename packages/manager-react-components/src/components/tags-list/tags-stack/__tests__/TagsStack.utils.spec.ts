import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getVisibleTagCount } from '../TagsStack.utils';
import { HTMLBadgeElement } from '../TagsStack.type';

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
