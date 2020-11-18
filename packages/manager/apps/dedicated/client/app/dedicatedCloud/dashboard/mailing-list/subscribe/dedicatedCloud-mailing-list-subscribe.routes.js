export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.ml-subscribe', {
    url: '/ml-subscribe',
    views: {
      modal: {
        component: 'ovhManagerPccMailingListSubscribe',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
    },
  });
};
