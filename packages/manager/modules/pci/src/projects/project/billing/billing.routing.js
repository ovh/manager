import controller from './billing.controller';
import template from './billing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing', {
    url: '/billing',
    controller,
    controllerAs: 'BillingCtrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('cpbc_billing_control'),
    },
  });
};
