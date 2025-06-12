export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'billing.autorenew.terminateEnterpriseCloudDatabaseRedirection',
    {
      url: '/delete-enterprise-cloud-database?serviceId',
      redirectTo: 'billing.autorenew.services.terminateEnterpriseCloudDatabase',
    },
  );

  $stateProvider.state(
    'billing.autorenew.services.terminateEnterpriseCloudDatabase',
    {
      url: '/delete-enterprise-cloud-database?serviceId',
      views: {
        modal: {
          component: 'billingAutorenewTerminateEnterpriseCloudDatabase',
        },
      },
      layout: 'modal',
      translations: { value: ['.'], format: 'json' },
      resolve: {
        goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
        serviceId: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceId,
        terminateEnterpriseCloudDatabase: /* @ngInject */ (
          OvhApiCloudDBEnterprise,
          serviceId,
        ) => () =>
          OvhApiCloudDBEnterprise.v6().terminate({ clusterId: serviceId })
            .$promise,
        breadcrumb: () => null,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
