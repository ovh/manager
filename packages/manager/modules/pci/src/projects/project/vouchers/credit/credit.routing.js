export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers.credit', {
    url: '/credit/buy',
    layout: 'modal',
    views: {
      modal: {
        componentProvider: /* @ngInject */ (coreConfig) =>
          coreConfig.isRegion('US')
            ? 'pciProjectsProjectVouchersCreditAgora'
            : 'pciProjectsProjectVouchersCreditLegacy',
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
