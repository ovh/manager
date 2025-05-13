import controller from './billing-history-balance.controller';
import template from './billing-history-balance.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.account.billing.main.history.balance', {
      url: '/balance',
      template,
      controller,
      controllerAs: '$ctrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_history_balance_title'),
      },
    });
  }
};
