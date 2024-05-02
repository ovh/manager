export const uniqBy = function uniqBy<I, U>(arr: I[], cb: (item: I) => U) {
  return [
    ...arr
      .reduce((map: Map<U, I>, item?: I) => {
        if (!map.has(cb(item))) map.set(cb(item), item);

        return map;
      }, new Map())
      .values(),
  ];
};
