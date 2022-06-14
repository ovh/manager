import set from 'lodash/set';
import ipaddr from 'ipaddr.js';

export default /* @ngInject */ () => ({
  require: 'ngModel',
  restrict: 'A',
  link(scope, element, attrs, modelCtrl) {
    set(modelCtrl, '$validators.ipSubnetValidator', (value) => {
      let gatewayCIDR;
      try {
        gatewayCIDR = ipaddr.parseCIDR(
          scope.$eval(attrs.nutanixDashboardRedeployIpSubnetValidator),
        );
      } catch (e) {
        gatewayCIDR = null;
      }
      if (value && ipaddr.isValid(value) && gatewayCIDR) {
        return ipaddr.parse(value)?.match(gatewayCIDR);
      }
      return true;
    });
  },
});
