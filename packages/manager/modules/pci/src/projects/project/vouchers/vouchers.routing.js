import controller from './vouchers.controller';
import template from './vouchers.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers', {
    url: '/vouchers',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: $translate => $translate
        .refresh()
        .then(() => $translate.instant('cpb_project_management_credit_vouchers')),
    },
  });
};
