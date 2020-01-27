export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.terminate-email-option', {
    url: '/terminateEmail',
    views: {
      modal: {
        component: 'hostingTerminateEmail',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToHosting) => goToHosting,
    },
  });
};
