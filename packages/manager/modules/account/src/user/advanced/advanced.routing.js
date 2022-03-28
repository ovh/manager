export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.user.advanced', {
    url: '/advanced',
    component: 'accountUserAdvanced',
    translations: ['../'],
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_advanced'),
    },
  });
};
