export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.ml-subscribe', {
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
