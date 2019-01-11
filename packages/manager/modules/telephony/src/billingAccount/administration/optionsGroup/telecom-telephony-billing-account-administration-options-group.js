angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.administration.optionsGroup', {
    url: '/optionsGroup',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/administration/optionsGroup/telecom-telephony-billing-account-administration-options-group.html',
        controller: 'TelecomTelephonyBillingAccountAdministrationOptionsGroup',
        controllerAs: 'OptionsGroupCtrl',
      },
    },
    translations: ['.'],
  });
});
