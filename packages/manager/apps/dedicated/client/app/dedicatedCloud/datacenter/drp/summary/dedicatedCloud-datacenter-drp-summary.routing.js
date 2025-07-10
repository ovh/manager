export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.summary',
    {
      url: '/summary',
      views: {
        'innerView@app.dedicatedCloud.details.datacenter.details.drp': {
          component: 'dedicatedCloudDatacenterDrpSummary',
        },
      },
      params: {
        drpInformations: {},
      },
      redirectTo: (transition) => {
        return transition
          .injector()
          .getAsync('isZertoOnPremise')
          .then((isZertoOnPremise) => {
            return (
              !isZertoOnPremise &&
              'app.dedicatedCloud.details.datacenter.details.drp.listing'
            );
          });
      },
      resolve: {
        goToDeleteDrpModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.drp.summary.deleteDrp',
          ),
        breadcrumb: () => null,
      },
    },
  );
};
