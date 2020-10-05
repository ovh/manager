export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app', {
    url: '/dbaas-logs',
    component: 'DbaasLogs',
  });
};
