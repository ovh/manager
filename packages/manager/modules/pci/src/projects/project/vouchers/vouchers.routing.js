export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers', {
    url: '/vouchers',
    component: 'pciProjectVouchers',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cpb_project_management_credit_vouchers'),
    },
  });
};
