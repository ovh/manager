import controller from './billing-main-history-debt-details.controller';
import template from './billing-main-history-debt-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.account.billing.main.history.details.debt.details',
    {
      url: '/details',
      template,
      controller,
      controllerAs: '$ctrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_history_details'),
      },
    },
  );
};
