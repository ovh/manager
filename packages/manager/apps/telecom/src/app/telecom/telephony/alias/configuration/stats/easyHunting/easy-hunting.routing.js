import template from './easy-hunting.html';
import controller from './easy-hunting.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.stats.easyHunting',
    {
      url: '/easyHunting',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias': {
          template,
          controller,
          controllerAs: 'StatsEasyHuntingCtrl',
        },
      },
    },
  );
};
