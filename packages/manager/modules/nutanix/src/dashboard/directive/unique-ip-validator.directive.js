import set from 'lodash/set';
import ipaddr from 'ipaddr.js';

function removeCurrentElement(arr, currentElement) {
  if (currentElement) {
    const indexOfCurrentElement = arr.indexOf(currentElement);
    if (indexOfCurrentElement !== -1) {
      arr.splice(indexOfCurrentElement, 1);
    }
  }
}

export default /* @ngInject */ () => ({
  require: 'ngModel',
  restrict: 'A',
  link(scope, element, attrs, modelCtrl) {
    set(modelCtrl, '$validators.uniqueIpValidator', (value) => {
      const ips = scope
        .$eval(attrs.nutanixDashboardRedeployUniqueIpValidator)
        .filter((ip) => ipaddr.isValid(ip));
      removeCurrentElement(ips, modelCtrl.$modelValue);
      if (value && ipaddr.isValid(value)) {
        return !ips.some((ip) => ip === value);
      }
      return true;
    });
  },
});
