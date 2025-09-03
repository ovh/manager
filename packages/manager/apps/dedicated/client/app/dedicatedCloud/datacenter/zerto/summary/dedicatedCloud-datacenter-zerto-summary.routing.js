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
          .get('$q')
          .all({
            isZertoOnPremise: transition
              .injector()
              .getAsync('isZertoOnPremise'),
            shouldBeConfigured: transition
              .injector()
              .getAsync('shouldBeConfigured'),
          })
          .then(({ isZertoOnPremise, shouldBeConfigured }) => {
            return (
              isZertoOnPremise &&
              !shouldBeConfigured &&
              'app.dedicatedCloud.details.datacenter.details.zerto.listing'
            );
          });
      },
      resolve: {
        goToDeleteSiteZertoModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.zerto.summary.deleteZerto',
          ),
        breadcrumb: () => null,
      },
    },
  );
};
