export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app', {
    url: '',
    template: '<div data-ui-view></div>',
    redirectTo: 'app.index',
    resolve: {
      breadcrumb: () => 'account',
    },
  });
};
