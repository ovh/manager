export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.cdrs', {
    url: '/cdr',
    component: 'carrierSipCdr',
  });
};
