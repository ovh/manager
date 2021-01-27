import controller from './billing-main.controller';
import template from './billing-main.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.main', {
    url: '',
    template,
    controller,
    controllerAs: '$ctrl',
    redirectTo: 'app.account.billing.main.history',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_main_title'),
    },
  });
};
