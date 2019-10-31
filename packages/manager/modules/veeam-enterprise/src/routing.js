export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app', {
      url: '/veeam-enterprise',
      component: 'ovhManagerVeeamEnterpriseComponent',
    });
};
