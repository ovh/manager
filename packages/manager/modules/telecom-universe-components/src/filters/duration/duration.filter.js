import isFinite from 'lodash/isFinite';
import 'moment';

export default /* @ngInject */ ($filter) =>
  function durationFilter(seconds) {
    if (isFinite(seconds)) {
      return $filter('date')(moment.unix(seconds).toDate(), 'HH:mm:ss', 'UTC');
    }
    return '-';
  };
