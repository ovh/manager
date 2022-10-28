export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.infos';

  $stateProvider.state(name, {
    url: '/infos',
    component: 'userAccountComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_infos'),
    },
  });
};
