export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip', {
    url: '/configuration/ip',
    component: 'ip',
    redirectTo: 'app.ip.dashboard',
  });
};
