export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('deskaas.details.confirm-terminate', {
    url: '/confirm-terminate',
    views: {
      modal: {
        component: 'deskaasConfirmTerminateComponent',
      },
    },
    layout: 'modal',
  });
};
