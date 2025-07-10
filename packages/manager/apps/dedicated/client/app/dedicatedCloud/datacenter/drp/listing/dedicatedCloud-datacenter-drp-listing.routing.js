export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.listing',
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
              'app.dedicatedCloud.details.datacenter.details.drp',
          ),
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
