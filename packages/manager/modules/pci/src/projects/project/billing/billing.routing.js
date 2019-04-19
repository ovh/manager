import controller from './billing.controller';
import template from './billing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing', {
    url: '/billing',
    controller,
    controllerAs: '$ctrl',
    template,
    resolve: {
      breadcrumb: $translate => $translate
        .refresh()
        .then(() => $translate.instant('cpbc_billing_control')),
    },
  });
};
