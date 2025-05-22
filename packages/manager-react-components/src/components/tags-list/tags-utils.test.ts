// tags-utils.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateAuthorizedTags, truncateTag, filterTags } from './tags-utils';

describe('calculateAuthorizedTags', () => {
  let container: HTMLDivElement;
  let tagElements: HTMLOdsBadgeElement[];

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '300px';
    container.style.height = '60px';
    Object.defineProperty(container, 'offsetWidth', { value: 300 });
    Object.defineProperty(container, 'offsetHeight', { value: 60 });

    tagElements = Array.from({ length: 5 }).map(() => {
      const tag = document.createElement(
        'div',
      ) as unknown as HTMLOdsBadgeElement;
      Object.defineProperty(tag, 'offsetHeight', { value: 20 });
      Object.defineProperty(tag, 'getBoundingClientRect', {
        value: () => ({ width: 50 }) as DOMRect,
      });
      return tag;
    });
  });

  it('should calculate how many tags can fit', () => {
    const result = calculateAuthorizedTags(tagElements, container, 2);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(tagElements.length);
  });

  it('should return undefined if container is null', () => {
    const result = calculateAuthorizedTags(tagElements, null as any, 2);
    expect(result).toBeUndefined();
  });
});

describe('truncateTag', () => {
  it('should truncate the text proportionally to the container size', () => {
    const container = document.createElement('div');
    const tag = document.createElement('div') as unknown as HTMLOdsBadgeElement;
    const fullText = 'LongTagNameForTesting';

    Object.defineProperty(container, 'offsetWidth', { value: 100 });
    Object.defineProperty(tag, 'getBoundingClientRect', {
      value: () => ({ width: 200 }) as DOMRect,
    });

    const result = truncateTag(container, tag, fullText);
    expect(result.length).toBeLessThan(fullText.length + 1);
    expect(result.endsWith('...')).toBe(true);
  });

  it('should return full text if fits completely', () => {
    const container = document.createElement('div');
    const tag = document.createElement('div') as unknown as HTMLOdsBadgeElement;
    const shortText = 'Tag';

    Object.defineProperty(container, 'offsetWidth', { value: 200 });
    Object.defineProperty(tag, 'getBoundingClientRect', {
      value: () => ({ width: 100 }) as DOMRect,
    });

    const result = truncateTag(container, tag, shortText);
    expect(result).toBe(shortText);
  });
});

describe('filterTags', () => {
  const tags = {
    environment: 'dev',
    environment1: 'prod',
    'ovh:internal': 'prod',
  };

  it('should return all tags when displayInternalTags is true', () => {
    const result = filterTags({ tags, displayInternalTags: true });
    expect(result).toEqual([
      'environment:dev',
      'environment1:prod',
      'ovh:internal:prod',
    ]);
  });

  it('should filter out internal tags when displayInternalTags is false', () => {
    const result = filterTags({ tags, displayInternalTags: false });
    expect(result).toEqual(['environment:dev', 'environment1:prod']);
  });

  it('should return an empty array if tags is empty', () => {
    const result = filterTags({ tags: {}, displayInternalTags: true });
    expect(result).toEqual([]);
  });
});
