import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import sortBy from 'lodash/sortBy';

angular.module('managerApp').filter('orderHashByKey', () => (items) => {
  const sortedKeys = sortBy(keys(items), (key) => key);

  const newHash = {};
  forEach(sortedKeys, (key) => {
    newHash[key] = items[key];
  });
  return newHash;
});
