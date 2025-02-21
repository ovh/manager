export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.infos';

  $stateProvider.state(name, {
    url: '/infos?fieldToFocus',
    component: 'userAccountComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_infos'),
      fieldToFocus: /* @ngInject */ ($stateParams) => $stateParams.fieldToFocus,
    },
  });
};
