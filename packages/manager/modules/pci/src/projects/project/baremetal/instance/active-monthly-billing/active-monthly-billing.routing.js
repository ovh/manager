export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.baremetal.instance.active-monthly-billing',
    {
      url: '/billing/monthly/activate',
      views: {
        modal: {
          component: 'pciInstancesInstanceActiveMonthlyBilling',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        breadcrumb: () => null,
      },
    },
  );
};
