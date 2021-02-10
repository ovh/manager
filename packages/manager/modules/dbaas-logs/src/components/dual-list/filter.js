export default () => (items, sourceFilterKey, property) =>
  items.filter((item) => {
    if (!property) {
      return true;
    }
    const value = property
      .split('.')
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), item);
    return value.match(new RegExp(sourceFilterKey, 'i'));
  });
