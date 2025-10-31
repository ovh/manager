export function hashCode(value: unknown): number {
  const str = (() => {
    switch (typeof value) {
      case 'number':
      case 'bigint':
      case 'boolean':
      case 'string':
        return String(value);
      case 'object':
        return value === null ? 'null' : JSON.stringify(value);
      case 'function':
        return 'function';
      case 'undefined':
        return 'undefined';
      default:
        return 'symbol';
    }
  })();

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 32 - hash + str.charCodeAt(i)) % 2147483647;
  }

  return hash;
}
