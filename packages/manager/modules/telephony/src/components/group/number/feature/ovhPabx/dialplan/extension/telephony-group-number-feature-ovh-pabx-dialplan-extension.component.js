(function () {
  angular.module('managerApp').component('telephonyNumberOvhPabxDialplanExtension', {
    templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/dialplan/extension/telephony-group-number-feature-ovh-pabx-dialplan-extension.html',
    bindings: {
      extension: '=',
    },
    require: {
      numberCtrl: '^^telephonyNumber',
      ovhPabxCtrl: '^^telephonyNumberOvhPabx',
      dialplanCtrl: '^^telephonyNumberOvhPabxDialplan',
    },
    controller: 'telephonyNumberOvhPabxDialplanExtensionCtrl',
  });
}());
