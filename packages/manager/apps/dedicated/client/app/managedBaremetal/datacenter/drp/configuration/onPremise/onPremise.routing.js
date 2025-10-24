export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.onPremise',
    {
      url: '/onPremise',
      abstract: true,
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.ovhPccStep',
    },
  );
};
