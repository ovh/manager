angular.module('managerApp').filter('dualListFilter', () => function (items, sourceFilterKey, property) {
  return items.filter((item) => {
    if (!property) {
      return true;
    }
    const value = property.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), item);
    return value.match(new RegExp(sourceFilterKey, 'i'));
  });
});
