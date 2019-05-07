import controller from './billing.controller';
import template from './billing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing', {
    url: '/billing',
    controller,
    controllerAs: 'BillingCtrl',
    template,
    translations: {
      format: 'json',
      value: ['.'],
    },
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate
        .refresh()
        .then(() => $translate.instant('cpbc_billing_control')),
    },
  });
};
