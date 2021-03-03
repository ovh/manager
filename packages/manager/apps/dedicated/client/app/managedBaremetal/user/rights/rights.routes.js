export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.user.rights', {
    url: '/rights',
    views: {
      'pccUserView@app.managedBaremetal.details.users':
        'dedicatedCloudUserRights',
    },
    resolve: {
      editRight: /* @ngInject */ ($state, userId) => (rightId) =>
        $state.go('app.managedBaremetal.details.users.user.rights.edit', {
          rightId,
          userId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('managed_baremetal_user_rights'),
    },
  });
};
