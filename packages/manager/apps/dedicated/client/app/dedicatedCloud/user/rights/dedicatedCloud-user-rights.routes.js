export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.user.rights', {
    url: '/rights',
    views: {
      'pccUserView@app.dedicatedCloud.details.users':
        'dedicatedCloudUserRights',
    },
    resolve: {
      editRight: /* @ngInject */ ($state, userId) => (rightId) =>
        $state.go('app.dedicatedCloud.details.users.user.rights.edit', {
          rightId,
          userId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_users_rights'),
    },
  });
};
