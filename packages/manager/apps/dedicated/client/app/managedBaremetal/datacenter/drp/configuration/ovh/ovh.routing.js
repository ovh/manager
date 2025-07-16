export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.ovh',
    {
      url: '/ovh',
      abstract: true,
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.ovh',
    },
  );
};
