import isString from 'lodash/isString';

export default /* @ngInject */ function($q, ovhUserPref) {
  this.get = function get(key) {
    if (isString(key)) {
      return ovhUserPref.getValue(key.toUpperCase()).then(
        (data) => $q.when(data || {}),
        () => ({}),
      );
    }
    return $q.reject('UserPref key must be of type String');
  };

  this.set = function set(key, value) {
    // We do it asynchronously and assume everything is ok.
    if (isString(key)) {
      return ovhUserPref
        .assign(key.toUpperCase(), value || {})
        .then(() => $q.when(value));
    }
    return $q.reject('UserPref key must be of type String');
  };
}
