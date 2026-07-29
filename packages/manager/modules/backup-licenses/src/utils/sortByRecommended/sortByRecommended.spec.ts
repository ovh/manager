import { describe, expect, it } from 'vitest';

import { sortByRecommended } from './sortByRecommended';

describe('sortByRecommended', () => {
  it('moves the recommended item to the top', () => {
    const items = [
      { key: 'a', recommended: false },
      { key: 'b', recommended: true },
      { key: 'c', recommended: false },
    ];

    expect(sortByRecommended(items).map((item) => item.key)).toEqual(['b', 'a', 'c']);
  });

  it('keeps the original order when no item is recommended', () => {
    const items = [
      { key: 'a', recommended: false },
      { key: 'b', recommended: false },
    ];

    expect(sortByRecommended(items).map((item) => item.key)).toEqual(['a', 'b']);
  });

  it('does not mutate the input array', () => {
    const items = [
      { key: 'a', recommended: false },
      { key: 'b', recommended: true },
    ];

    sortByRecommended(items);

    expect(items.map((item) => item.key)).toEqual(['a', 'b']);
  });
});
