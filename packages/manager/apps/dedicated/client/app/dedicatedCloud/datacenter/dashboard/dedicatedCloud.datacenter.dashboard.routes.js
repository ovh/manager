export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard',
    {
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterDashboard',
      },
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
