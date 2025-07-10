export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.listing',
    {
      url: '/listing',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details': {
          component: 'dedicatedCloudDatacenterDrpListing',
        },
      },
      params: {},
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('isZertoOnPremise')
          .then(
            (isZertoOnPremise) =>
              !isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.drp',
          ),
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
