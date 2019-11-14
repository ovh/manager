angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.configuration.lines.add', {
    url: '/add',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/lines/add/telecom-telephony-alias-configuration-lines-add.html',
        controller: 'TelecomTelephonyAliasConfigurationLinesAddCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['..'], format: 'json' },
  });
});
