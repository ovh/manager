export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('deskaas.details.get-console-access', {
    url: '/get-console-access',
    views: {
      modal: {
        component: 'deskaasGetConsoleAccessComponent',
      },
    },
    layout: 'modal',
  });
};
