export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.addSite',
    {
      url: '/add-site',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
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
