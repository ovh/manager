export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.summary',
    {
      url: '/summary',
      views: {
        'innerView@app.dedicatedCloud.details.datacenter.details.zerto': {
          component: 'dedicatedCloudDatacenterZertoSummary',
        },
      },
      params: {
        zertoInformations: {},
      },
      redirectTo: (transition) => {
        return transition
          .injector()
          .getAsync('isZertoOnPremise')
          .then((isZertoOnPremise) => {
            return (
              isZertoOnPremise &&
              'app.dedicatedCloud.details.datacenter.details.zerto.listing'
            );
          });
      },
      resolve: {
        goToDeleteZertoModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.zerto.summary.deleteZerto',
          ),
        breadcrumb: () => null,
      },
    },
  );
};
