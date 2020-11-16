export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.hosts.order',
    {
      resolve: {
        goBack: /* @ngInject */ (goBackToHost) => goBackToHost,
      },
      url: '/order',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterHostOrder',
      },
    },
  );
};
