angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.configuration.timeCondition', {
    url: '/timeCondition',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/timeCondition/telecom-telephony-alias-configuration-time-condition.html',
        controller: 'TelecomTelephonyAliasConfigurationTimeConditionCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
