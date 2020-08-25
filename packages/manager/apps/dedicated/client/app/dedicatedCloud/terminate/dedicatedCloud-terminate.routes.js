export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.dedicatedClouds.dashboard.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: 'dedicatedCloudTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      serviceInfos: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/dedicatedCloud/${serviceName}/serviceInfos`)
          .then(({ data }) => data),
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
