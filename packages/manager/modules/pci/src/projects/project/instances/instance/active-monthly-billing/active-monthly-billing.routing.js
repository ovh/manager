export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.active-monthly-billing', {
      url: '/billing/monthly/activate',
      views: {
        modal: {
          component: 'pciInstancesInstanceActiveMonthlyBilling',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        breadcrumb: () => null,
      },
    });
};
