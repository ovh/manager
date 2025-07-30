import isEqual from 'lodash.isequal';

function getItemsByKey<I, U>(items: I[], cb: (item: I) => U): I[] {
  if (!items) {
    return [];
  }

  return [
    ...items
      .reduce((map: Map<U, I>, item: I) => {
        if (!map.has(cb(item))) map.set(cb(item), item);
        return map;
      }, new Map())
      .values(),
  ];
}

function stackItems<I, U>(
  items: I[],
  cb?: (item: I) => U,
): Map<U | undefined, I[]> {
  const stacks = new Map<U | undefined, I[]>();

  if (cb) {
    const uniques = getItemsByKey<I, U>(items, cb);
    uniques.forEach((unique) => {
      const key = cb(unique);
      stacks.set(key, []);
      const stackItem = stacks.get(key);
      if (stackItem && items) {
        const filteredItems = items.filter(
          (item) => item && isEqual(key, cb(item)),
        );
        stackItem.push(...filteredItems);
      }
    });
  } else {
    stacks.set(undefined, items || []);
  }

  return stacks;
}

export { stackItems };
