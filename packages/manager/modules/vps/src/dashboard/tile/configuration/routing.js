export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.configuration', {
    url: '/configuration',
    abstract: true,
    template: '<div data-ui-view></div>',
  });
};
