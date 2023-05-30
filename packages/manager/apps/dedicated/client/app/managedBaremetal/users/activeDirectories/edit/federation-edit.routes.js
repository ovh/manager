export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.federation-edit', {
    url: '/federation/edit',
    params: {
      activeDirectory: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUsersActiveDirectoriesEdit',
      },
    },
    layout: { name: 'modal', backdrop: 'static' },
    resolve: {
      activeDirectory: /* @ngInject */ ($transition$) =>
        $transition$.params().activeDirectory,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicatedCloud_USER_AD_edit_title'),
    },
    atInternet: {
      rename:
        'dedicated::managedBaremetal::details::users::update-active-directory',
    },
  });
};
