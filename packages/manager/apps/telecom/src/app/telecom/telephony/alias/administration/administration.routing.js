import template from './administration.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.administration',
    {
      url: '/administration',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          template,
          controller: 'TelecomTelephonyAliasAdministrationCtrl',
          controllerAs: 'AliasAdministrationCtrl',
        },
      },
    },
  );
};
