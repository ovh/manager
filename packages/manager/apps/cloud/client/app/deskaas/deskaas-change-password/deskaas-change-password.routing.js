export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('deskaas.details.change-password', {
    url: '/change-password',
    views: {
      modal: {
        component: 'deskaasChangePasswordComponent',
      },
    },
    layout: 'modal',
  });
};
