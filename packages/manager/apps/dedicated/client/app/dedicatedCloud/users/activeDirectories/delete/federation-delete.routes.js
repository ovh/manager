export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.federation-delete', {
    url: '/federation/delete',
    params: {
      activeDirectory: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUsersActiveDirectoriesDelete',
      },
    },
    layout: { name: 'modal', backdrop: 'static' },
    resolve: {
      activeDirectory: /* @ngInject */ ($transition$) =>
        $transition$.params().activeDirectory,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicatedCloud_USER_AD_delete_title'),
    },
  });
};
