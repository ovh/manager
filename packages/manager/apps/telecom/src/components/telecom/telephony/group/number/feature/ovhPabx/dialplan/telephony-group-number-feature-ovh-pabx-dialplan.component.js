(function () {
  angular.module('managerApp').component('telephonyNumberOvhPabxDialplan', {
    templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/dialplan/telephony-group-number-feature-ovh-pabx-dialplan.html',
    bindings: {
      dialplan: '=telephonyNumberOvhPabxDialplan',
    },
    require: {
      numberCtrl: '^^telephonyNumber',
      ovhPabxCtrl: '^^telephonyNumberOvhPabx',
    },
    controller: 'telephonyNumberOvhPabxDialplanCtrl',
  });
}());
