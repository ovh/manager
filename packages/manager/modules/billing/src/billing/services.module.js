const moduleName = 'ovhManagerBillingServicesModule';
// TODO : remove this when ovh-angular-apiv7 npm install is fixed
angular.module(moduleName, []).service(
  'BillingBill',
  /* @ngInject */ ($resource) =>
    $resource(
      '/me/bill/:billId',
      {
        billId: '@billId',
      },
      {
        getById: {
          serviceType: 'apiv7',
          method: 'GET',
          isArray: true,
        },
      },
    ),
);

export default moduleName;
