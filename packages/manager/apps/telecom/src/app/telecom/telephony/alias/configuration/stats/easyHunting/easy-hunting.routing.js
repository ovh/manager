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
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_alias_configuration_stats_easyhunting_title',
          ),
      },
    },
  );
};
