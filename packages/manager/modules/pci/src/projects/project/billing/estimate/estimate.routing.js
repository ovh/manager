import controller from './estimate.controller';
import template from './estimate.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.estimate', {
    url: '/estimate',
    template,
    controller,
    controllerAs: 'BillingConsumptionEstimateCtrl',
    resolve: {
      breadcrumb: $translate => $translate
        .refresh()
        .then(() => $translate.instant('cpbc_tab_forecast')),
    },
  });
};
