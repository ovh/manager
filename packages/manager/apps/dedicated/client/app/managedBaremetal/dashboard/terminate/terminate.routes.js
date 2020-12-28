export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.managedBaremetal.dashboard.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: 'dedicatedCloudTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      serviceInfos: /* @ngInject */ (dedicatedCloudServiceInfos) =>
        dedicatedCloudServiceInfos,
      canDeleteAtExpiration: /* @ngInject */ (
        currentUser,
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('dedicated-cloud:deleteAtExpiration')
          .then(
            (featureAvailability) =>
              featureAvailability.isFeatureAvailable(
                'dedicated-cloud:deleteAtExpiration',
              ) && !currentUser.isEnterprise,
          ),
    },
  });
