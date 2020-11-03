export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.user.advanced', {
    url: '/advanced',
    component: 'accountUserAdvanced',
  });
};
