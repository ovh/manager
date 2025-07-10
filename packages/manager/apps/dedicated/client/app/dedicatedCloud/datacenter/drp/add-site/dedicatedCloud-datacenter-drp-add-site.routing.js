export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.addSite',
    {
      url: '/add-site',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
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
