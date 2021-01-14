export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.account.billing.autorenew.terminateEnterpriseCloudDatabase',
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
