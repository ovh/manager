angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.timeCondition.oldPabx',
    {
      url: '/oldPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/timeCondition/oldPabx/telecom-telephony-alias-configuration-time-condition-old-pabx.html',
          controller:
            'TelecomTelephonyAliasConfigurationTimeConditionOldPabxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
