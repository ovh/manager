angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.convertToLine',
    {
      url: '/convert',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/administration/convertToLine/telecom-telephony-alias-administration-convert-to-line.html',
          controller: 'TelecomTelephonyAliasAdministrationConvertToLineCtrl',
          controllerAs: 'AliasConvertCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
