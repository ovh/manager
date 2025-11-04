import isEqual from 'lodash.isequal';

function getItemsByKey<I, U>(items: I[], cb: (item: I) => U): I[] {
  if (!items) {
    return [];
  }

  const map = items.reduce<Map<U, I>>((acc, item) => {
    const key = cb(item);
    if (!acc.has(key)) acc.set(key, item);
    return acc;
  }, new Map<U, I>());

  return Array.from(map.values());
}

function stackItems<I, U>(items: I[], cb?: (item: I) => U): Map<U | undefined, I[]> {
  const stacks = new Map<U | undefined, I[]>();

  if (cb) {
    const uniques = getItemsByKey<I, U>(items, cb);
    uniques.forEach((unique) => {
      const key = cb(unique);
      const filteredItems = items.filter((item) => isEqual(key, cb(item)));
      stacks.set(key, filteredItems);
    });
  } else {
    stacks.set(undefined, items ?? []);
  }

  return stacks;
}

export { stackItems };
