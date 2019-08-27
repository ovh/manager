(function () {
  angular.module('managerApp').component('telephonyNumberOvhPabxDialplanExtensionRule', {
    templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/dialplan/extension/rule/telephony-group-number-feature-ovh-pabx-dialplan-extension-rule.html',
    bindings: {
      rule: '=',
    },
    require: {
      numberCtrl: '^^telephonyNumber',
      ovhPabxCtrl: '^^telephonyNumberOvhPabx',
      dialplanCtrl: '^^telephonyNumberOvhPabxDialplan',
      extensionCtrl: '^^telephonyNumberOvhPabxDialplanExtension',
    },
    controller: 'telephonyNumberOvhPabxDialplanExtensionRuleCtrl',
  });
}());
