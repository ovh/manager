import controller from './billing-main-pay-as-you-go.controller';
import template from './billing-main-pay-as-you-go.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.account.billing.main.pay-as-you-go', {
      url: '/payAsYouGo',
      controller,
      controllerAs: '$ctrl',
      template,
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_main_pay_as_you_go'),
      },
    });
  }
};
