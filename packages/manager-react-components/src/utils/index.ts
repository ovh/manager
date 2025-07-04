export const uniqBy = function uniqBy<I, U>(arr: I[], cb: (item: I) => U) {
  return [
    ...arr
      .reduce((map: Map<U, I>, item: I) => {
        if (!map.has(cb(item))) map.set(cb(item), item);
        return map;
      }, new Map())
      .values(),
  ];
};

// eslint-disable-next-line
export const hashCode = (param: any) => {
  let h = 0;
  const s = ((p): string => {
    switch (typeof p) {
      case 'number':
        return `${p}`;
      case 'bigint':
        return `${p}`;
      case 'string':
        return `${p}`;
      case 'boolean':
        return `${p}`;
      case 'object':
        return JSON.stringify(p);
      case 'function':
        return 'function';
      case 'undefined':
        return 'undefined';
      default:
        return 'symbol';
    }
  })(param);
  const l = s?.length || 0;
  let i = 0;
  // eslint-disable-next-line
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
};
