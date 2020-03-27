export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app', {
    url: '/metrics',
    component: 'Metrics',
  });
};
