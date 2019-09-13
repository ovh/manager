angular.module('managerApp').filter('orderHashByKey', () => (items) => {
  const sortedKeys = _.sortBy(_.keys(items), key => key);

  const newHash = {};
  _.forEach(sortedKeys, (key) => {
    newHash[key] = items[key];
  });
  return newHash;
});
