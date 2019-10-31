export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app', {
      url: '/vps',
      component: 'ovhManagerVpsComponent',
    });
};
