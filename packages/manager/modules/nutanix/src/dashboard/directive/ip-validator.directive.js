import set from 'lodash/set';
import ipaddr from 'ipaddr.js';

export default /* @ngInject */ () => ({
  require: 'ngModel',
  restrict: 'A',
  link(_scope, _element, _attrs, modelCtrl) {
    set(modelCtrl, '$validators.ipValidator', (value) => {
      return !value || (value.split('.').length === 4 && ipaddr.isValid(value));
    });
  },
});
