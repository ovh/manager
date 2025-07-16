export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.addSite',
    {
      url: '/add-site',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'dedicatedCloudDatacenterZerto',
      },
      params: {
        selectedZertoType: null,
      },
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
