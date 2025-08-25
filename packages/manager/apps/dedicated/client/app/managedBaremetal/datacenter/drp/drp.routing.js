export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp',
    {
      url: '/zerto',
      params: {
        selectedZertoType: null,
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.listing',
    },
  );
};
