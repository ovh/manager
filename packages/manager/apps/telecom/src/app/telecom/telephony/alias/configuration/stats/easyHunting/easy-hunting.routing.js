import template from './easy-hunting.html';
import controller from './easy-hunting.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.stats.easyHunting',
    {
      url: '/easyHunting',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          template,
          controller,
          controllerAs: 'StatsEasyHuntingCtrl',
        },
      },
    },
  );
};
