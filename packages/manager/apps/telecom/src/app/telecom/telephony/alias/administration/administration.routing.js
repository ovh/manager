import template from './administration.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.administration',
    {
      url: '/administration',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller: 'TelecomTelephonyAliasAdministrationCtrl',
          controllerAs: 'AliasAdministrationCtrl',
        },
      },
    },
  );
};
