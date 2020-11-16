export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.rights', {
    url: '/:userId/rights',
    params: {
      userId: null,
    },
    views: {
      pccUserView: 'dedicatedCloudUserRights',
    },
    resolve: {
      editRight: /* @ngInject */ ($state, userId) => (rightId) =>
        $state.go('app.dedicatedCloud.details.users.rights.edit', {
          rightId,
          userId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_users_rights'),
    },
  });
};
