export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.dashboard',
    {
      url: '',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'ovhManagerDedicatedCloudDatacenterDashboard',
      },
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
