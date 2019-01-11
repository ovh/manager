angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.timeCondition.oldPabx', {
    url: '/oldPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/timeCondition/oldPabx/telecom-telephony-alias-configuration-time-condition-old-pabx.html',
        controller: 'TelecomTelephonyAliasConfigurationTimeConditionOldPabxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
