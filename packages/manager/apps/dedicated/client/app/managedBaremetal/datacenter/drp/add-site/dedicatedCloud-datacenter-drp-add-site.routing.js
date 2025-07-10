export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.addSite',
    {
      url: '/add-site',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'dedicatedCloudDatacenterDrp',
      },
      params: {
        selectedDrpType: null,
      },
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
